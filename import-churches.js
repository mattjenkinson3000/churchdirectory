#!/usr/bin/env node
/**
 * import-churches.js
 * Reads scrape1.xlsx, scrape2.xlsx, scrape3.xlsx from ./data/,
 * deduplicates, maps denominations, and upserts into Supabase.
 *
 * Run from project root:
 *   node import-churches.js
 */

const fs   = require('fs')
const path = require('path')
const XLSX = require('xlsx')
const { createClient } = require('@supabase/supabase-js')

// ─── Load .env.local ────────────────────────────────────────────────────────

function loadEnvLocal() {
  const envPath = path.join(__dirname, '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env.local not found')
    process.exit(1)
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const match = line.match(/^([^#=\s][^=]*)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const val = match[2].trim().replace(/^['"]|['"]$/g, '')
      process.env[key] = process.env[key] ?? val
    }
  }
}

loadEnvLocal()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Constants ───────────────────────────────────────────────────────────────

const DATA_DIR = path.join(__dirname, 'data')
const FILES    = ['scrape1.xlsx', 'scrape2.xlsx', 'scrape3.xlsx']
const BATCH    = 50

// Churches that already exist — skip by name match (case-insensitive)
const EXISTING_CHURCH_NAMES = [
  "st patrick's cathedral",
  'ponsonby baptist church',
  'ponsonby baptist',
  'christchurch cathedral',
]

// Denomination keyword → Supabase denomination_id
// Ordered so more-specific terms are checked first
const DENOMINATION_MAP = [
  { keywords: ['seventh-day adventist', 'adventist', 'sda'],  id: 8  },
  { keywords: ['eastern orthodox', 'orthodox'],               id: 10 },
  { keywords: ['catholic'],                                   id: 1  },
  { keywords: ['anglican', 'church of england'],              id: 2  },
  { keywords: ['baptist'],                                    id: 3  },
  { keywords: ['presbyterian'],                               id: 4  },
  { keywords: ['methodist'],                                  id: 5  },
  { keywords: ['pentecostal', 'apostolic'],                   id: 6  },
  { keywords: ['lutheran'],                                   id: 9  },
  { keywords: ['evangelical', 'charismatic'],                 id: 12 },
]
const DEFAULT_DENOMINATION_ID = 13 // Non-denominational

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Return the first value from a row object whose key matches any of the
 * given candidate names (case-insensitive).
 */
function col(row, ...candidates) {
  const keys = Object.keys(row)
  for (const c of candidates) {
    const key = keys.find(k => k.toLowerCase() === c.toLowerCase())
    if (key !== undefined && row[key] !== null && row[key] !== '') return row[key]
  }
  return null
}

/** Map a subtypes string to a denomination_id. */
function mapDenomination(subtypes) {
  if (!subtypes) return DEFAULT_DENOMINATION_ID
  const lower = String(subtypes).toLowerCase()
  for (const { keywords, id } of DENOMINATION_MAP) {
    if (keywords.some(kw => lower.includes(kw))) return id
  }
  return DEFAULT_DENOMINATION_ID
}

/**
 * Extract suburb from the street/address field.
 * Tries to grab the second-to-last comma-segment, which is usually the suburb.
 * Falls back to null if the field isn't detailed enough.
 */
function extractSuburb(streetField, addressField) {
  const src = streetField || addressField || ''
  const parts = src.split(',').map(p => p.trim()).filter(Boolean)
  if (parts.length >= 3) return parts[parts.length - 2] // e.g. "Street, Suburb, City, NZ"
  if (parts.length === 2) return parts[0]               // e.g. "Suburb, City"
  return null
}

/** Convert a church name to a URL-safe slug. */
function toSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Ensure a slug is unique within the set of already-used slugs. */
function uniqueSlug(base, usedSlugs) {
  let slug = base
  let counter = 2
  while (usedSlugs.has(slug)) {
    slug = `${base}-${counter}`
    counter++
  }
  usedSlugs.add(slug)
  return slug
}

/** Read one xlsx file and return an array of plain objects. */
function readXlsx(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  WARN: file not found — ${filePath} (skipping)`)
    return []
  }
  const wb   = XLSX.readFile(filePath)
  const ws   = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(ws, { defval: null })
  console.log(`  Read ${rows.length.toLocaleString()} rows from ${path.basename(filePath)}`)
  return rows
}

/** Insert rows into Supabase in batches, return { inserted, errors }. */
async function batchInsert(rows) {
  let inserted = 0
  let errors   = 0

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase
      .from('churches')
      .insert(batch)
      .select('id')

    if (error) {
      console.error(`  Batch ${Math.floor(i / BATCH) + 1} error:`, error.message)
      errors += batch.length
    } else {
      inserted += batch.length
      process.stdout.write(`  Inserted ${Math.min(i + BATCH, rows.length)} / ${rows.length}\r`)
    }
  }
  process.stdout.write('\n')
  return { inserted, errors }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n══════════════════════════════════════════')
  console.log('  FindMyChurch NZ — Church Importer')
  console.log('══════════════════════════════════════════\n')

  // 1. Read all Excel files
  console.log('Step 1: Reading Excel files…')
  const allRows = FILES.flatMap(f => readXlsx(path.join(DATA_DIR, f)))
  console.log(`  Total rows across all files: ${allRows.length.toLocaleString()}\n`)

  // 2. Deduplicate by place_id
  console.log('Step 2: Deduplicating by place_id…')
  const seenPlaceIds = new Set()
  const deduped = []
  let dupCount = 0
  for (const row of allRows) {
    const pid = col(row, 'place_id', 'placeid', 'place id', 'PlaceId', 'Place_ID')
    if (pid && seenPlaceIds.has(pid)) {
      dupCount++
      continue
    }
    if (pid) seenPlaceIds.add(pid)
    deduped.push(row)
  }
  console.log(`  Removed ${dupCount} duplicates — ${deduped.length.toLocaleString()} unique rows remain\n`)

  // 3. Filter OPERATIONAL
  console.log('Step 3: Filtering to OPERATIONAL businesses…')
  const operational = deduped.filter(row => {
    const status = col(row, 'business_status', 'BusinessStatus', 'status', 'Status')
    return !status || status.toString().toUpperCase() === 'OPERATIONAL'
  })
  const removedStatus = deduped.length - operational.length
  console.log(`  Removed ${removedStatus} non-operational rows — ${operational.length.toLocaleString()} remain\n`)

  // 4. Skip existing test churches & map columns
  console.log('Step 4: Mapping columns and skipping existing test churches…')
  const usedSlugs   = new Set()
  const skipped     = []
  const mapped      = []

  for (const row of operational) {
    const name = col(row, 'name', 'Name', 'church_name', 'title') || ''

    // Skip known test churches
    if (EXISTING_CHURCH_NAMES.includes(name.toLowerCase().trim())) {
      skipped.push(name)
      continue
    }

    const placeId     = col(row, 'place_id', 'placeid', 'place id', 'PlaceId', 'Place_ID')
    const fullAddress = col(row, 'address', 'full_address', 'Address', 'formatted_address')
    const streetField = col(row, 'street', 'Street', 'street_address')
    const city        = col(row, 'city', 'City', 'town', 'Town')
    const latitude    = col(row, 'latitude', 'lat', 'Latitude', 'Lat')
    const longitude   = col(row, 'longitude', 'lng', 'lon', 'Longitude', 'Lng', 'Lon')
    const phone       = col(row, 'phone', 'Phone', 'phone_number', 'telephone', 'PhoneNumber')
    const website     = col(row, 'website', 'Website', 'web', 'Web', 'url', 'URL')
    const subtypes    = col(row, 'subtypes', 'Subtypes', 'subtype', 'type', 'Type', 'category', 'Category')
    const rating      = col(row, 'rating', 'Rating', 'google_rating', 'GoogleRating')
    const reviews     = col(row, 'reviews', 'Reviews', 'review_count', 'ReviewCount', 'user_ratings_total')
    const photo       = col(row, 'photo', 'Photo', 'photo_url', 'PhotoUrl', 'PhotoURL', 'thumbnail')
    const locationLink = col(row, 'location_link', 'LocationLink', 'maps_url', 'MapsUrl', 'maps_link', 'google_maps_url')

    const denominationId = mapDenomination(subtypes)
    const suburb         = extractSuburb(streetField, fullAddress)

    // Build base slug from name + city for better uniqueness
    const slugBase = city
      ? `${toSlug(name)}-${toSlug(city.toString())}`
      : toSlug(name)
    const slug = uniqueSlug(slugBase || `church-${mapped.length + 1}`, usedSlugs)

    mapped.push({
      name:                name.trim(),
      address:             fullAddress   ? String(fullAddress).trim()   : null,
      suburb:              suburb        ? String(suburb).trim()        : null,
      city:                city          ? String(city).trim()          : null,
      latitude:            latitude      != null ? parseFloat(latitude) : null,
      longitude:           longitude     != null ? parseFloat(longitude): null,
      phone:               phone         ? String(phone).trim()         : null,
      website:             website       ? String(website).trim()       : null,
      denomination_id:     denominationId,
      google_rating:       rating        != null ? parseFloat(rating)   : null,
      google_review_count: reviews       != null ? parseInt(reviews, 10): null,
      place_id:            placeId       ? String(placeId).trim()       : null,
      photo_url:           photo         ? String(photo).trim()         : null,
      location_link:       locationLink  ? String(locationLink).trim()  : null,
      slug,
      is_active:           true,
      is_verified:         false,
    })
  }

  if (skipped.length > 0) {
    console.log(`  Skipped ${skipped.length} existing test church(es): ${skipped.join(', ')}`)
  }
  console.log(`  Ready to import: ${mapped.length.toLocaleString()} churches\n`)

  if (mapped.length === 0) {
    console.log('Nothing to import. Exiting.')
    return
  }

  // Preview first record
  console.log('Preview (first mapped record):')
  console.log(JSON.stringify(mapped[0], null, 2))
  console.log()

  // 5. Insert in batches
  console.log(`Step 5: Inserting into Supabase in batches of ${BATCH}…`)
  const { inserted, errors } = await batchInsert(mapped)

  // ── Summary ──────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════')
  console.log('  Import Summary')
  console.log('══════════════════════════════════════════')
  console.log(`  Total rows in Excel files:   ${allRows.length.toLocaleString()}`)
  console.log(`  Removed (duplicates):        ${dupCount.toLocaleString()}`)
  console.log(`  Removed (non-operational):   ${removedStatus.toLocaleString()}`)
  console.log(`  Skipped (existing churches): ${skipped.length.toLocaleString()}`)
  console.log(`  Attempted to insert:         ${mapped.length.toLocaleString()}`)
  console.log(`  ✓ Inserted successfully:     ${inserted.toLocaleString()}`)
  if (errors > 0) {
    console.log(`  ✗ Failed (batch errors):     ${errors.toLocaleString()}`)
  }
  console.log('══════════════════════════════════════════\n')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
