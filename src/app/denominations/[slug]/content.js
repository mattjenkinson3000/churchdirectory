// Static content overrides for denomination pages.
// These supplement (and take precedence over) the short_description and
// full_description values stored in the Supabase denominations table.
// Add an entry here whenever a denomination needs richer editorial copy
// without requiring a database write.

export const denominationContent = {
  anglican: {
    short_description:
      "The Anglican Church in Aotearoa has deep roots in the Church of England tradition, shaped by liturgical worship, the beauty of the Book of Common Prayer, and a generous theological breadth. Anglican churches hold together Scripture, tradition and reason, welcoming people from many backgrounds into a shared faith in Jesus Christ.",
    full_description: [
      "Anglican worship is shaped by a rhythm of prayer, Scripture and sacrament. Services range from traditional liturgy steeped in centuries of Christian heritage to contemporary expressions that feel accessible to newcomers. What holds Anglicans together is not uniformity of style but a shared commitment to following Jesus within an ancient and global communion.",
      "The Anglican Church in Aotearoa, New Zealand and Polynesia is one of the most culturally diverse churches in the country, with M\u0101ori, P\u0101keh\u0101 and Pasifika strands woven together in a unique three-tikanga structure. This reflects a deep commitment to honouring the Treaty of Waitangi and walking faithfully in Aotearoa.",
      "Whether you are drawn to candlelit evensong, a quiet early morning communion, or a lively family service, you are likely to find an Anglican church that feels like home.",
    ],
  },

  baptist: {
    short_description:
      "Baptist churches in Aotearoa are evangelical communities built around the authority of Scripture, believer\u2019s baptism, and the conviction that each local church is free to be led by Christ without outside control. Warm, welcoming and mission-focused, Baptist churches are found in cities and towns across New Zealand.",
    full_description: [
      "At the heart of Baptist life is a personal faith in Jesus Christ, expressed through baptism as a public declaration of that faith. Baptists believe that every person must come to faith freely, which is why baptism is reserved for those who have made that decision for themselves rather than as infants.",
      "Baptist churches are self-governing, which means each congregation has its own character and culture. Some are traditional in style, others contemporary, but all share a commitment to the Bible as God\u2019s Word, the centrality of the gospel, and the importance of community.",
      "In Aotearoa, Baptist churches have a long history of serving their local communities through social care, youth work, and mission. If you are looking for a church that is grounded in Scripture, genuine in community and active in its neighbourhood, a Baptist church may be your home.",
    ],
  },

  catholic: {
    short_description:
      "The Catholic Church is the largest Christian denomination in Aotearoa New Zealand, with a presence stretching back to the earliest missionaries in the 1800s. Rooted in 2,000 years of unbroken tradition, Catholic worship centres on the Eucharist, the sacraments, and a deep reverence for the life, death and resurrection of Jesus Christ.",
    full_description: [
      "Catholic faith is sacramental at its core. The Mass, celebrated every Sunday and often daily, is the heart of Catholic worship, where bread and wine become the body and blood of Christ in the Eucharist. The sacraments mark every stage of life, from baptism at birth through to the anointing of the sick.",
      "Catholics hold to the authority of Scripture and Sacred Tradition, interpreted through the teaching office of the Church led by the Pope and bishops in succession from the apostles. This sense of continuity with the early church is something Catholics treasure deeply.",
      "In Aotearoa, the Catholic Church serves communities through parishes, schools, hospitals and social services. Masses are celebrated in English, M\u0101ori, and many other languages, reflecting the rich cultural diversity of Catholic communities across New Zealand.",
      "If you are searching for a church with deep roots, rich tradition and a sacramental life centred on Christ, a Catholic parish may be your home.",
    ],
  },

  'eastern-orthodox': {
    short_description:
      "The Eastern Orthodox Church is one of the oldest expressions of Christianity in the world, tracing its roots directly to the apostles. Known for its ancient liturgy, reverence for icons, and deep theological tradition, Orthodox worship is an encounter with the living God through beauty, symbol and prayer.",
    full_description: [
      "Orthodox Christianity was shaped by the great councils of the early church and has preserved those foundations largely unchanged for over a thousand years. Where Western Christianity divided into Catholic and Protestant streams, Orthodoxy maintained its own path, centred on the mystery of theosis, the belief that human beings are called to participate in the divine life of God.",
      "Orthodox worship is unlike anything else in Christianity. The Divine Liturgy, typically sung in full, draws worshippers into a timeless act of praise that feels connected to heaven itself. Icons are not idols but windows into the heavenly realm, and the church building is understood as a foretaste of the Kingdom of God.",
      "In New Zealand, Orthodox communities are small but deeply committed, often drawing people from Greek, Russian, Serbian, Romanian and other backgrounds, as well as Kiwis who have discovered Orthodoxy through their own journey of faith.",
      "If you are searching for an ancient faith, a transcendent worship experience and a theology of great depth, an Orthodox church may be your home.",
    ],
  },

  'evangelical-charismatic': {
    short_description:
      "Evangelical and charismatic churches place personal faith in Jesus Christ at the centre of everything. Known for contemporary worship, a passion for the gifts of the Holy Spirit, and a heart for sharing the gospel, these churches are among the most energetic and growing communities in Aotearoa today.",
    full_description: [
      "Evangelical Christianity is defined by four core convictions: the authority of Scripture, the centrality of the cross, the necessity of personal conversion, and the importance of sharing the faith. For evangelicals, knowing Jesus personally is not just a starting point but the ongoing heartbeat of the Christian life.",
      "Charismatic churches add to this a strong emphasis on the present-day work of the Holy Spirit, including gifts such as prophecy, healing and speaking in tongues. Worship is typically contemporary, expressive and participatory, often led by a band and characterised by sung prayer and spontaneous response.",
      "These churches tend to be outward-facing, passionate about evangelism, community transformation and caring for the vulnerable. If you are new to faith or looking for a church with energy, warmth and a strong sense of the Spirit\u2019s presence, an evangelical or charismatic church may be your home.",
    ],
  },

  lutheran: {
    short_description:
      "Lutheran churches are part of the Reformation tradition founded by Martin Luther in the 16th century, built on the conviction that salvation comes by grace alone, through faith alone, in Christ alone. Lutherans hold Scripture in the highest authority and gather around the preached Word and the sacraments of baptism and communion.",
    full_description: [
      "Martin Luther\u2019s rediscovery of grace transformed the church and the world. At the heart of Lutheran theology is the radical good news that no one earns their standing before God, it is a gift received through trust in Jesus Christ. This shapes everything about Lutheran worship and community life.",
      "Lutheran services tend to be liturgical, following a structured order of worship that moves through confession, Scripture, sermon and sacrament. There is a strong tradition of sacred music in Lutheran churches, from the great hymns of Luther himself to the choral works of Bach, who considered his music a gift offered to God.",
      "In New Zealand, Lutheran congregations are relatively small but deeply rooted, often with connections to German, Scandinavian and other European communities. If you are drawn to a theology of grace, a reverence for Scripture and a worship tradition shaped by centuries of faithful practice, a Lutheran church may be your home.",
    ],
  },

  methodist: {
    short_description:
      "Methodist churches in Aotearoa are part of a movement founded by John Wesley in the 18th century, shaped by a deep belief in God\u2019s grace available to all people. Known for warm community life, a strong commitment to social justice, and accessible worship, Methodist churches have served New Zealand for nearly 200 years.",
    full_description: [
      "John Wesley preached that God\u2019s grace goes before us, meets us in our need, and carries us all the way home. This generous understanding of grace has always made Methodist churches welcoming places, open to people at every stage of faith and from every background.",
      "Methodist worship varies widely, from traditional hymn-singing to contemporary services, but a sense of warmth and welcome is characteristic across the movement. Small groups and midweek community have always been central to Methodist life, reflecting Wesley\u2019s conviction that faith grows best in community.",
      "The Methodist Church in New Zealand has a proud history of engagement with social issues, from advocating for the poor to standing alongside M\u0101ori in the pursuit of justice. This commitment to loving the neighbour in practical ways remains strong today.",
      "If you are looking for a church that combines genuine faith, open arms and a concern for the world beyond its walls, a Methodist church may be your home.",
    ],
  },

  'non-denominational': {
    short_description:
      "Non-denominational churches in Aotearoa follow Jesus Christ without affiliating with any specific denomination or tradition. Often contemporary in style, centred on the Bible, and deeply community-focused, these churches are some of the fastest growing in New Zealand.",
    full_description: [
      "Non-denominational churches emerged from a desire to strip back to the essentials of Christian faith and remove barriers that might keep people from encountering Jesus. Without the structures of a denomination, each church is free to develop its own culture, governance and expression of worship.",
      "What non-denominational churches share is a commitment to the authority of Scripture, the centrality of the gospel, and the importance of genuine Christian community. Many invest heavily in small groups, pastoral care, and community outreach, seeking to be a church that serves its city as much as it serves its members.",
      "Worship is typically contemporary, with a band-led service, expressive congregational singing and Bible-centred preaching. Many non-denominational churches are also multigenerational, investing significantly in children, youth and young adults.",
      "If you are new to faith, returning after time away, or simply looking for a fresh start in a church without the weight of tradition, a non-denominational church may be your home.",
    ],
  },

  pentecostal: {
    short_description:
      "Pentecostal churches in Aotearoa are Spirit-filled communities marked by expressive worship, a belief in the present-day gifts of the Holy Spirit, and a passion for evangelism. Rooted in the great Pentecostal revivals of the early 20th century, these churches are among the most vibrant and growing in New Zealand today.",
    full_description: [
      "Pentecostalism was born out of a conviction that the Holy Spirit poured out on the day of Pentecost is still moving today. Pentecostal churches expect God to be active in the present, through healing, prophecy, speaking in tongues and other gifts described in the New Testament.",
      "Worship in Pentecostal churches is typically contemporary, energetic and participatory. Services often have a strong sense of expectation and spiritual atmosphere, with significant time given to sung worship before the preaching of the Word. Many Pentecostal churches are large and well-resourced, with strong programmes for children, youth and young adults.",
      "Pentecostals are passionate about sharing their faith and seeing lives transformed by the gospel. If you are looking for a church with spiritual energy, a culture of expectation and a heart to reach the lost, a Pentecostal church may be your home.",
    ],
  },

  presbyterian: {
    short_description:
      "Presbyterians are part of the Reformed tradition, shaped by the conviction that Scripture alone is the ultimate authority for faith and life. Governed by elders and rooted in a deep commitment to grace and truth, Presbyterian churches have served communities across Aotearoa for generations. Whether traditional or contemporary in style, you'll find a church that takes God's Word seriously and welcomes you warmly.",
    full_description: [
      "Presbyterians are part of the Reformed tradition, shaped by the conviction that Scripture alone is the ultimate authority for faith and life. At the heart of Presbyterian worship is the preaching of God\u2019s Word, sung praise, and the sacraments of baptism and communion shared together as a covenant community.",
      "Presbyterian churches are governed by elders, both teaching elders (ministers) and ruling elders, who together provide spiritual oversight and care for the congregation. This shared leadership reflects a deep belief that Christ alone is the head of the church.",
      "With strong historical roots in Scotland and a long presence in Aotearoa, Presbyterian churches today are found in cities, towns and rural communities across New Zealand. They range from traditional to contemporary in worship style, but share a common commitment to grace, truth and the flourishing of their local communities.",
      "If you are searching for a church that takes Scripture seriously, values thoughtful preaching and welcomes you into a community built on grace, a Presbyterian church may be your home.",
    ],
  },

  'seventh-day-adventist': {
    short_description:
      "Seventh-day Adventist churches are a Christian denomination with a distinctive rhythm of life centred on the Sabbath, observed from Friday sunset to Saturday sunset. Adventists hold to the authority of Scripture, salvation through Jesus Christ, and a holistic view of health and wellbeing that has shaped their communities for over 150 years.",
    full_description: [
      "Adventists are firmly Christian, holding to core beliefs including the Trinity, the divinity and humanity of Jesus Christ, salvation by grace through faith, and the physical return of Christ. What makes Adventism distinctive is its observance of the seventh-day Sabbath as a day of rest, worship and renewal, a practice they trace directly from Scripture and the example of Jesus.",
      "Adventist worship on Saturday morning typically includes Bible study, congregational singing, and a sermon centred on Scripture. Adventist churches are known for their warm hospitality, often sharing a communal meal after the service.",
      "Adventists have a longstanding commitment to health, operating hospitals and health services around the world, and many Adventists follow a plant-based or vegetarian diet as an expression of caring for the body God has given them.",
      "In New Zealand, Adventist churches serve communities across the country. If you are drawn to a church that honours the Sabbath, takes Scripture seriously and cares for the whole person, a Seventh-day Adventist church may be your home.",
    ],
  },
}
