
/* ============================================================
   SUPABASE CONFIG
   Replace ONLY these two values.
   Use the Project URL and the Publishable key from Supabase.
   NEVER put a secret/service_role key in this file.
   ============================================================ */
const SUPABASE_URL = "https://fzwsmvwvraruktyyiscr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_E2ghL9KbeoQ-GghejXbrQw_ie0wrjH_";

const SAVED_PROJECTS_TABLE = "quiz_projects";
let supabaseClient = null;
let supabaseUser = null;

const DEFAULT_DATA = [
{s:"SECTION A — ANCIENT HISTORY & ART/CULTURE"},
{q:"With reference to the Second Urbanisation in the Indian subcontinent, consider the following statements:\n1. The emergence of urban centres was associated with the expansion of craft production.\n2. The use of punch-marked coins is associated with this period.\n3. The emergence of cities was confined exclusively to the Gangetic plains.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"With reference to Buddhist architecture, consider the following:\n1. A chaitya was primarily associated with worship.\n2. A vihara was primarily a monastic residence.\n3. Every chaitya necessarily contained a free-standing Buddha image.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 and 3 only",C:"1 only",D:"1, 2 and 3"},a:"A"},
{q:"Which one of the following pairs is correctly matched?\n1. Arikamedu — Roman trade connections\n2. Dholavira — Water-management structures\n3. Sanchi — Buddhist monuments\n4. Nagarjunakonda — Harappan urban centre\nSelect the correct answer using the code below:",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"C"},
{q:"Consider the following statements regarding Sangam literature:\n1. It contains references to different ecological regions.\n2. It provides information about social and economic life in early historic South India.\n3. All Sangam texts were composed exclusively in the Mauryan period.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"The term \"Gana\" or \"Sangha\" in ancient Indian political history is most closely associated with:",o:{A:"hereditary absolute monarchy",B:"oligarchic or republican forms of political organisation",C:"village-level temple administration alone",D:"military administration under the Mauryas"},a:"B"},
{q:"Consider the following pairs:\n1. Ajanta — Buddhist paintings\n2. Bagh — Buddhist paintings\n3. Sittannavasal — Jain paintings\n4. Lepakshi — Vijayanagara paintings\nHow many of the above pairs are correctly matched?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"D"},
{q:"With reference to Jain philosophy, consider the following statements:\n1. Anekantavada recognises the complexity or multiplicity of viewpoints concerning reality.\n2. Syadvada is associated with conditional predication.\n3. Jainism regards all forms of knowledge as necessarily false.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which one of the following is most closely associated with the Panchasiddhantika?",o:{A:"Astronomy",B:"Grammar",C:"Medicine",D:"Political philosophy"},a:"A"},
{q:"Consider the following:\n1. Prakrit inscriptions\n2. Sanskrit inscriptions\n3. Tamil-Brahmi inscriptions\nWhich of the above have contributed to historians' understanding of early Indian society?",o:{A:"1 only",B:"1 and 2 only",C:"1, 2 and 3",D:"2 and 3 only"},a:"C"},
{q:"With reference to Indian temple architecture, consider the following statements:\n1. The Nagara tradition is broadly associated with northern India.\n2. The Dravida tradition is broadly associated with southern India.\n3. The distinction between Nagara and Dravida is based only on the geographical location of the temple.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 and 3 only",C:"1 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following were important features of the Bhakti traditions in medieval India?\n1. Use of vernacular languages\n2. Personal devotion to a chosen deity\n3. Complete rejection of all existing social institutions by every Bhakti saint\n4. Composition of devotional poetry and songs\nHow many of the above are correct?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"C"},
{q:"Consider the following pairs:\n1. Chishti — Sufi tradition\n2. Lingayat — Shaiva tradition\n3. Alvar — Vaishnava tradition\n4. Nayanar — Buddhist tradition\nWhich of the pairs given above are correctly matched?",o:{A:"1, 2 and 3 only",B:"1 and 4 only",C:"2 and 3 only",D:"1, 2, 3 and 4"},a:"A"},
{q:"The Pala school of Buddhist art is particularly associated with:",o:{A:"Kashmir and Ladakh",B:"eastern India",C:"western Deccan",D:"Tamil Nadu"},a:"B"},
{q:"Consider the following statements regarding ancient Indian mathematics:\n1. The decimal place-value system developed significantly in the Indian mathematical tradition.\n2. Indian mathematical ideas subsequently influenced mathematical traditions outside India.\n3. The concept of zero had no role in the development of Indian mathematics.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which one of the following best explains the importance of guilds (shrenis) in ancient India?",o:{A:"They were exclusively military organisations.",B:"They were associations of artisans or merchants involved in economic activity.",C:"They were assemblies of Buddhist monks.",D:"They functioned only as judicial courts of the king."},a:"B"},
{q:"Consider the following monuments:\n1. Kailasanatha Temple, Kanchipuram\n2. Virupaksha Temple, Pattadakal\n3. Brihadisvara Temple, Thanjavur\n4. Shore Temple, Mahabalipuram\nWhich of the above are associated with the development of the Dravida architectural tradition?",o:{A:"1, 2 and 3 only",B:"1, 3 and 4 only",C:"2 and 4 only",D:"1, 2, 3 and 4"},a:"D"},

{s:"SECTION B — MODERN HISTORY"},
{q:"With reference to the Revolt of 1857, consider the following statements:\n1. It had different regional centres and leaders.\n2. The nature and objectives of the revolt were identical in all regions.\n3. The revolt involved sections of soldiers as well as civilians.\nWhich of the statements given above is/are correct?",o:{A:"1 and 3 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"The Ilbert Bill controversy is significant in Indian colonial history because it concerned:",o:{A:"Indian participation in legislative councils",B:"judicial equality between Europeans and Indians",C:"separation of Burma from India",D:"introduction of dyarchy"},a:"B"},
{q:"Consider the following pairs:\n1. Swadeshi Movement — Partition of Bengal\n2. Home Rule Movement — First World War period\n3. Quit India Movement — Cripps Mission\n4. Civil Disobedience Movement — Simon Commission\nHow many pairs are correctly matched?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"D"},
{q:"Which of the following developments contributed to the growth of Indian nationalism?\n1. Expansion of modern education\n2. Development of newspapers\n3. Growth of railways and communications\n4. Economic critique of colonial rule\nSelect the correct answer using the code below:",o:{A:"1 and 2 only",B:"2 and 3 only",C:"1, 2, 3 and 4",D:"1 and 4 only"},a:"C"},
{q:"Consider the following statements regarding the Government of India Act, 1935:\n1. It proposed an all-India federation.\n2. It introduced provincial autonomy.\n3. It abolished separate electorates completely.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},

{s:"SECTION C — GEOGRAPHY"},
{q:"Consider the following statements about the Indian monsoon:\n1. Differential heating of land and sea contributes to seasonal circulation.\n2. The Tibetan Plateau influences atmospheric circulation.\n3. The monsoon is caused exclusively by the reversal of surface winds over the Indian Ocean.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following can influence the intensity or distribution of Indian monsoon rainfall?\n1. El Niño\n2. Indian Ocean Dipole\n3. Himalayan snow conditions\n4. Madden-Julian Oscillation\nHow many of the above are correct?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"D"},
{q:"Consider the following pairs:\n1. Delta — River deposition\n2. U-shaped valley — Glacial erosion\n3. Yardang — Wind erosion\n4. Karst cave — Chemical weathering\nHow many pairs are correctly matched?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"D"},
{q:"A river that forms a large delta is generally characterised by:",o:{A:"extremely high gradient throughout its course",B:"substantial sediment deposition near its mouth",C:"absence of distributaries",D:"exclusive flow through limestone terrain"},a:"B"},
{q:"Consider the following statements about ocean currents:\n1. They redistribute heat.\n2. They can influence coastal climates.\n3. They are driven solely by differences in surface temperature.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which one of the following pairs is correctly matched?",o:{A:"Upwelling — downward movement of nutrient-poor surface water",B:"El Niño — anomalous warming of the central/eastern tropical Pacific",C:"La Niña — weakening of trade winds in all circumstances",D:"Thermocline — boundary between crust and mantle"},a:"B"},
{q:"Consider the following statements about soils:\n1. Laterite formation is associated with intense leaching.\n2. Black soils have important associations with basaltic regions.\n3. Alluvial soils are necessarily poor in potash.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 and 3 only",C:"1 only",D:"1, 2 and 3"},a:"A"},
{q:"If a location experiences a high annual temperature range and low humidity, which of the following environments is it more likely to represent?",o:{A:"Maritime tropical environment",B:"Continental interior environment",C:"Equatorial rainforest",D:"Oceanic island environment"},a:"B"},
{q:"With reference to the Himalayas, consider the following statements:\n1. The Himalayas are geologically young fold mountains.\n2. The region remains tectonically active.\n3. Earthquakes are impossible in the Himalayas because the mountains have already attained stability.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},

{s:"SECTION D — ENVIRONMENT & ECOLOGY"},
{q:"Consider the following statements:\n1. Primary productivity refers to the rate at which producers generate organic matter.\n2. Gross primary productivity includes the energy used in plant respiration.\n3. Net primary productivity is lower than gross primary productivity.\nWhich of the statements given above is/are correct?",o:{A:"1 and 3 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following can be considered examples of ecosystem services?\n1. Pollination\n2. Carbon sequestration\n3. Water purification\n4. Soil formation\nSelect the correct answer using the code below:",o:{A:"1 and 2 only",B:"1, 2 and 3 only",C:"2 and 4 only",D:"1, 2, 3 and 4"},a:"D"},
{q:"Consider the following statements about invasive alien species:\n1. Every non-native species is invasive.\n2. An invasive species may alter native ecosystems.\n3. Invasive species can compete with native species for resources.\nWhich of the statements given above is/are correct?",o:{A:"2 and 3 only",B:"1 and 2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which one of the following best describes ecological succession?",o:{A:"Permanent extinction of a species",B:"Gradual change in the composition and structure of an ecological community",C:"Seasonal migration of animals",D:"Genetic mutation within an individual organism"},a:"B"},
{q:"Consider the following statements about wetlands:\n1. They can act as carbon sinks.\n2. They can reduce flood impacts.\n3. They necessarily contain freshwater only.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"With reference to protected areas in India, consider the following statements:\n1. National Parks generally have a higher degree of restriction on human activities than Wildlife Sanctuaries.\n2. A Biosphere Reserve may contain zones with different levels of protection.\n3. A Conservation Reserve can involve government land and conservation of landscapes/corridors.\nWhich of the statements given above is/are correct?",o:{A:"1 only",B:"1 and 2 only",C:"1, 2 and 3",D:"2 and 3 only"},a:"C"},
{q:"Consider the following pairs:\n1. Coral bleaching — thermal stress\n2. Eutrophication — excessive nutrient enrichment\n3. Biomagnification — increasing concentration of certain substances along trophic levels\n4. Desertification — necessarily formation of a sand desert\nHow many pairs are correctly matched?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"C"},
{q:"Which of the following gases contribute significantly to the enhanced greenhouse effect?\n1. Carbon dioxide\n2. Methane\n3. Nitrous oxide\n4. Water vapour\nSelect the correct answer using the code below:",o:{A:"1, 2 and 3 only",B:"1 and 2 only",C:"1, 2, 3 and 4",D:"2 and 3 only"},a:"C"},
{q:"Consider the following statements:\n1. Mangroves can reduce coastal erosion.\n2. Mangroves provide nursery habitats for several aquatic organisms.\n3. Mangrove ecosystems occur only in regions receiving more than 2000 mm annual rainfall.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},

{s:"SECTION E — SCIENCE & TECHNOLOGY"},
{q:"Consider the following statements regarding mRNA vaccines:\n1. They provide cells with genetic instructions for producing an antigen.\n2. The mRNA necessarily integrates into the recipient's nuclear DNA.\n3. The resulting antigen can stimulate an immune response.\nWhich of the statements given above is/are correct?",o:{A:"1 and 3 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"With reference to CRISPR-Cas systems, consider the following statements:\n1. They can be used to make targeted changes in genetic material.\n2. Cas proteins can function as molecular tools for cutting nucleic acids.\n3. CRISPR technology can never produce off-target effects.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which one of the following is most closely associated with gene therapy?",o:{A:"Modification or replacement of genetic material to treat disease",B:"Replacement of all proteins in a cell",C:"Destruction of all microorganisms in the human body",D:"Conversion of RNA into atmospheric nitrogen"},a:"A"},
{q:"Consider the following statements about semiconductors:\n1. Their electrical conductivity can lie between that of conductors and insulators.\n2. Doping can modify their electrical properties.\n3. Silicon is widely used in semiconductor technology.\n4. Semiconductor devices are limited exclusively to computers.\nHow many of the above statements are correct?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"C"},
{q:"Consider the following pairs:\n1. LiDAR — Laser-based distance measurement\n2. Radar — Radio waves\n3. Sonar — Sound waves\n4. Fibre optics — Transmission using light\nHow many pairs are correctly matched?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"D"},
{q:"With reference to quantum computing, consider the following statements:\n1. A qubit can exist in a superposition of states.\n2. Quantum entanglement can create correlations between quantum systems.\n3. A quantum computer is simply a conventional computer operating at a higher clock speed.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following are potential applications of quantum technology?\n1. Quantum communication\n2. Quantum sensing\n3. Quantum computing\n4. Quantum simulation\nSelect the correct answer using the code below:",o:{A:"1 and 2 only",B:"1, 2 and 3 only",C:"2, 3 and 4 only",D:"1, 2, 3 and 4"},a:"D"},
{q:"Consider the following statements about large language models (LLMs):\n1. They can generate text based on patterns learned from training data.\n2. They necessarily possess human-like understanding of every statement they generate.\n3. They may produce plausible but factually incorrect outputs.\nWhich of the statements given above is/are correct?",o:{A:"1 and 3 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"With reference to blockchain technology, consider the following statements:\n1. A blockchain can function as a distributed ledger.\n2. Every blockchain must necessarily be completely permissionless.\n3. Consensus mechanisms can be used to validate transactions or changes.\n4. Blockchain technology is synonymous with cryptocurrency.\nWhich of the above statements are correct?",o:{A:"1 and 3 only",B:"1, 2 and 3 only",C:"2 and 4 only",D:"1, 2, 3 and 4"},a:"A"},
{q:"Consider the following statements regarding green hydrogen:\n1. It is generally produced through electrolysis powered by renewable electricity.\n2. Its production can involve water as the feedstock.\n3. The hydrogen molecule itself contains carbon.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which one of the following technologies is most directly associated with additive manufacturing?",o:{A:"3D printing",B:"Conventional blast furnace",C:"Photolithography alone",D:"Nuclear fission"},a:"A"},
{q:"Consider the following statements about nuclear energy:\n1. Nuclear fission involves splitting a heavy atomic nucleus.\n2. Nuclear fusion involves combining light nuclei under suitable conditions.\n3. Commercial nuclear power plants currently rely primarily on controlled fusion.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"With reference to space technology, consider the following:\n1. Remote sensing satellites can provide information about Earth's surface.\n2. Geostationary satellites have orbital periods equal to Earth's rotation period.\n3. A geostationary satellite can remain fixed above every location on Earth.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following are potential uses of synthetic biology?\n1. Engineering microorganisms to produce useful chemicals\n2. Designing biological systems with specified functions\n3. Developing biological production platforms\n4. Making biological organisms completely independent of DNA\nHow many are correct?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"C"},

{s:"SECTION F — ECONOMY"},
{q:"Consider the following statements:\n1. Inflation refers to a sustained increase in the general price level.\n2. A fall in the inflation rate necessarily means that prices are falling.\n3. Deflation refers to a sustained decline in the general price level.\nWhich of the statements given above is/are correct?",o:{A:"1 and 3 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"If the Reserve Bank of India increases the policy interest rate, other things remaining equal, it may:\n1. Increase borrowing costs.\n2. Reduce aggregate demand.\n3. Reduce inflationary pressure.\nWhich of the above are correct?",o:{A:"1 only",B:"1 and 2 only",C:"1, 2 and 3",D:"2 and 3 only"},a:"C"},
{q:"Consider the following statements about repo rate:\n1. It is associated with short-term liquidity provided by RBI to banks.\n2. An increase in the repo rate can make borrowing more expensive.\n3. It is directly determined by the Union Finance Ministry.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following can increase the fiscal deficit, other things remaining constant?\n1. Increase in government expenditure\n2. Reduction in government revenue\n3. Increase in subsidies without a corresponding revenue increase",o:{A:"1 only",B:"1 and 2 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"D"},
{q:"Consider the following statements:\n1. Primary deficit = fiscal deficit − interest payments.\n2. Revenue deficit concerns the excess of revenue expenditure over revenue receipts.\n3. A government can have a fiscal deficit even when it has a revenue surplus.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 and 3 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"D"},
{q:"With reference to crowding out, consider the following statements:\n1. Large government borrowing can potentially put upward pressure on interest rates.\n2. Higher interest rates may reduce private investment.\n3. Crowding out necessarily occurs whenever the government runs any fiscal deficit.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Consider the following statements regarding the current account of the balance of payments:\n1. It includes trade in goods.\n2. It includes trade in services.\n3. It includes certain income and transfer flows.\n4. Foreign direct investment is itself a current-account item.\nHow many of the above statements are correct?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"C"},
{q:"A depreciation of the domestic currency, other things remaining equal, may:\n1. Make exports more competitive.\n2. Make imports more expensive in domestic currency.\n3. Always reduce the trade deficit immediately.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Consider the following statements regarding Foreign Direct Investment (FDI):\n1. It generally involves a lasting interest and significant influence in an enterprise.\n2. It is different from short-term portfolio investment.\n3. Every purchase of a foreign government bond automatically constitutes FDI.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following are generally considered functions of money?\n1. Medium of exchange\n2. Unit of account\n3. Store of value\n4. Means of producing inflation\nSelect the correct answer using the code below:",o:{A:"1, 2 and 3 only",B:"1 and 2 only",C:"2, 3 and 4 only",D:"1, 2, 3 and 4"},a:"A"},
{q:"Consider the following statements about Central Bank Digital Currency (CBDC):\n1. It is a digital form of sovereign currency issued by a central bank.\n2. It is identical in every respect to a decentralised cryptocurrency.\n3. CBDC can potentially enable digital payments without requiring a privately issued cryptocurrency.\nWhich of the statements given above is/are correct?",o:{A:"1 and 3 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"With reference to UPI, consider the following statements:\n1. It enables interoperable digital payments.\n2. It is itself a cryptocurrency.\n3. It can connect bank accounts through a payment infrastructure.\nWhich of the statements given above is/are correct?",o:{A:"1 and 3 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Consider the following statements about tokenisation of real-world assets:\n1. It can represent ownership or claims over assets through digital tokens.\n2. It necessarily converts every physical asset into cryptocurrency.\n3. It may involve blockchain or distributed-ledger technology.\nWhich of the statements given above is/are correct?",o:{A:"1 and 3 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following can help improve financial inclusion?\n1. Basic bank accounts\n2. Digital payment infrastructure\n3. Access to formal credit\n4. Financial literacy",o:{A:"1 and 2 only",B:"1, 2 and 3 only",C:"2, 3 and 4 only",D:"1, 2, 3 and 4"},a:"D"},
{q:"Consider the following statements regarding Non-Performing Assets (NPAs):\n1. An NPA reflects a loan asset that has stopped generating income for the bank according to regulatory criteria.\n2. High NPAs can weaken banks' profitability.\n3. NPAs necessarily mean that the borrower has committed fraud.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},

{s:"SECTION G — POLITY & GOVERNANCE"},
{q:"Consider the following statements:\n1. The Constitution establishes a parliamentary form of government at the Union level.\n2. The Council of Ministers is collectively responsible to the Lok Sabha.\n3. The President exercises all executive powers independently of the Council of Ministers.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"With reference to the Money Bill, consider the following statements:\n1. It can be introduced only in the Lok Sabha.\n2. The Rajya Sabha can recommend changes to it.\n3. The Lok Sabha is not bound to accept the Rajya Sabha's recommendations.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 and 3 only",C:"1, 2 and 3",D:"2 and 3 only"},a:"C"},
{q:"Consider the following statements about Fundamental Rights:\n1. They are enforceable by courts.\n2. Some Fundamental Rights are available only to citizens.\n3. Every Fundamental Right is absolute and cannot be restricted.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following are constitutional bodies?\n1. Election Commission of India\n2. Finance Commission\n3. NITI Aayog\n4. Union Public Service Commission\nSelect the correct answer using the code below:",o:{A:"1 and 2 only",B:"1, 2 and 4 only",C:"2, 3 and 4 only",D:"1, 2, 3 and 4"},a:"B"},
{q:"Consider the following statements about the Comptroller and Auditor General of India:\n1. The office is established by the Constitution.\n2. The CAG audits specified public accounts.\n3. The CAG is directly subordinate to the Union Finance Minister.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"With reference to the Governor of a State, consider the following statements:\n1. The Governor is appointed by the President.\n2. The Governor normally acts on the aid and advice of the Council of Ministers.\n3. The Governor is elected directly by the people of the State.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Consider the following statements regarding the 73rd Constitutional Amendment:\n1. It relates to Panchayati Raj institutions.\n2. It provided constitutional recognition to rural local self-government.\n3. It abolished all State-level variation in local government structures.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following are associated with constitutional amendment procedures in India?\n1. Simple majority in certain specified matters\n2. Special majority of Parliament\n3. Ratification by at least half of the States for certain federal provisions",o:{A:"1 only",B:"1 and 2 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"D"},
{q:"Consider the following statements:\n1. Judicial review allows courts to examine the constitutional validity of laws.\n2. Judicial review means that courts can automatically replace any policy preferred by the executive.\n3. The Constitution provides the foundation for judicial review in India.\nWhich of the statements given above is/are correct?",o:{A:"1 and 3 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},

{s:"SECTION H — SOCIAL ISSUES & GOVERNMENT SCHEMES"},
{q:"Consider the following statements regarding demographic transition:\n1. Fertility rates generally decline with socioeconomic development.\n2. Population ageing can become significant when fertility and mortality decline.\n3. Population ageing necessarily means population decline.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following can contribute to multidimensional poverty?\n1. Poor nutrition\n2. Lack of schooling\n3. Inadequate sanitation\n4. Lack of access to electricity\nSelect the correct answer using the code below:",o:{A:"1 and 2 only",B:"1, 2 and 3 only",C:"2, 3 and 4 only",D:"1, 2, 3 and 4"},a:"D"},
{q:"Consider the following statements:\n1. Public health interventions can generate positive externalities.\n2. Vaccination can protect individuals as well as reduce transmission in a population.\n3. Externalities are always negative.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},

{s:"SECTION I — INTERNATIONAL RELATIONS & CURRENT AFFAIRS"},
{q:"Consider the following pairs:\n1. WHO — Geneva\n2. WTO — Geneva\n3. UNESCO — Paris\n4. IMF — Washington, D.C.\nHow many pairs are correctly matched?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"D"},
{q:"Consider the following statements regarding the United Nations Security Council:\n1. It has five permanent members.\n2. Permanent members possess veto power on substantive matters.\n3. India is currently a permanent member of the Security Council.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following are members of BRICS as of the expanded grouping in the mid-2020s?\n1. India\n2. Brazil\n3. China\n4. South Africa\n5. Egypt\nSelect the correct answer using the code below:",o:{A:"1, 2 and 3 only",B:"1, 2, 3 and 4 only",C:"1, 2, 3, 4 and 5",D:"2, 3 and 5 only"},a:"C"},
{q:"Consider the following statements regarding the Indo-Pacific:\n1. It is primarily a geopolitical and strategic concept.\n2. India's Indo-Pacific policy includes maritime security and freedom of navigation.\n3. The term refers exclusively to countries bordering the Indian Ocean.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following are maritime chokepoints of major strategic significance?\n1. Strait of Hormuz\n2. Bab-el-Mandeb\n3. Strait of Malacca\n4. Suez Canal\nHow many of the above are correctly included?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"D"},
{q:"Consider the following statements regarding international climate negotiations:\n1. The Paris Agreement seeks to limit global temperature increase.\n2. Nationally Determined Contributions are central to the Paris Agreement framework.\n3. Every country has exactly the same emission-reduction obligation.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Consider the following pairs:\n1. Quad — India, United States, Japan, Australia\n2. AUKUS — Australia, United Kingdom, United States\n3. SCO — Shanghai Cooperation Organisation\n4. ASEAN — Association of Southeast Asian Nations\nHow many pairs are correctly matched?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"D"},
{q:"With reference to international trade, consider the following statements:\n1. A tariff is a tax imposed on imports or exports.\n2. A tariff on imports can raise the domestic price of the imported good.\n3. Tariffs always increase economic welfare for both exporting and importing countries.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"2 only",C:"1 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Consider the following statements about critical minerals:\n1. They may be strategically important for clean-energy technologies.\n2. Their importance can arise from concentrated geographical supply chains.\n3. Every critical mineral is necessarily a rare-earth element.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following are important for India's maritime security?\n1. Sea lines of communication\n2. Port infrastructure\n3. Maritime domain awareness\n4. Undersea cables\nSelect the correct answer using the code below:",o:{A:"1 and 2 only",B:"1, 2 and 3 only",C:"2, 3 and 4 only",D:"1, 2, 3 and 4"},a:"D"},
{q:"Consider the following statements:\n1. Sanctions can restrict trade or financial transactions.\n2. Secondary sanctions may affect entities that are not directly located in the sanctioning country.\n3. Sanctions can never affect global commodity prices.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"With reference to international institutions, consider the following:\n1. IMF — balance-of-payments support\n2. World Bank — development finance\n3. WTO — rules governing international trade\n4. WHO — international public health\nHow many pairs are correctly matched?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"D"},
{q:"Consider the following statements regarding India's neighbourhood:\n1. River-water management can become a component of bilateral relations.\n2. Cross-border connectivity can influence economic and strategic relations.\n3. Neighbourhood diplomacy is concerned exclusively with military security.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following can constitute soft power?\n1. Cultural influence\n2. Diplomacy\n3. Educational exchanges\n4. Attraction of a country's political values",o:{A:"1 and 2 only",B:"1, 2 and 3 only",C:"2, 3 and 4 only",D:"1, 2, 3 and 4"},a:"D"},
{q:"Consider the following statements regarding artificial intelligence governance:\n1. AI systems can raise concerns regarding privacy.\n2. Algorithmic bias can arise from data or system design.\n3. Generative AI systems are incapable of producing misinformation.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"With reference to digital public infrastructure, consider the following statements:\n1. It can provide interoperable digital services.\n2. It may reduce transaction costs.\n3. Digital public infrastructure necessarily means that all services must be operated directly by the government.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Consider the following pairs:\n1. Drones — Surveillance and logistics\n2. Satellites — Remote sensing and communication\n3. Undersea cables — Global digital connectivity\n4. Quantum communication — Secure communication applications\nHow many pairs are correctly matched?",o:{A:"Only one",B:"Only two",C:"Only three",D:"All four"},a:"D"},
{q:"Consider the following statements regarding semiconductor geopolitics:\n1. Semiconductor manufacturing requires specialised supply chains.\n2. Semiconductor fabrication plants can require large capital investments.\n3. Semiconductor supply chains are completely independent of geopolitics.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"},
{q:"Which of the following developments can influence food security?\n1. Climate variability\n2. Fertiliser availability\n3. Water availability\n4. Global commodity prices\nSelect the correct answer using the code below:",o:{A:"1 and 2 only",B:"1, 2 and 3 only",C:"2, 3 and 4 only",D:"1, 2, 3 and 4"},a:"D"},
{q:"Consider the following statements:\n1. A country's strategic autonomy does not necessarily imply isolation from international partnerships.\n2. A country can simultaneously participate in multiple international groupings with different objectives.\n3. Strategic partnerships necessarily require formal military alliances.\nWhich of the statements given above is/are correct?",o:{A:"1 and 2 only",B:"1 only",C:"2 and 3 only",D:"1, 2 and 3"},a:"A"}
];

// ---- state ----
let currentData = [];
let answered = 0;
let correctCount = 0;
let wrongCount = 0;
let marks = 0;
let timeUp = false;
let submitted = false;
let total = 0;
let MARK_CORRECT = 2;
let MARK_WRONG = -0.66;
let PASS_MARK = 120;
let timerInterval = null;
let remaining = 120 * 60;
let savedProjects = [];
let testStarted = false;
let testPaused = false;

const TEXT_ZOOM_KEY = 'prelimsify_text_zoom';
const TEXT_ZOOM_MIN = 80;
const TEXT_ZOOM_MAX = 140;
const TEXT_ZOOM_STEP = 10;

function getTextZoom(){
  const n = Number(localStorage.getItem(TEXT_ZOOM_KEY));
  return Number.isFinite(n) ? Math.min(TEXT_ZOOM_MAX, Math.max(TEXT_ZOOM_MIN, n)) : 100;
}

function applyTextZoom(){
  const zoom = getTextZoom();
  document.documentElement.style.setProperty('--text-zoom', `${zoom / 100}`);
  const label = document.getElementById('zoomPercent');
  if (label) label.textContent = `${zoom}%`;
  const out = document.getElementById('zoomOutBtn');
  const inn = document.getElementById('zoomInBtn');
  if (out) out.disabled = zoom <= TEXT_ZOOM_MIN;
  if (inn) inn.disabled = zoom >= TEXT_ZOOM_MAX;
}

function changeTextZoom(delta){
  const next = Math.min(TEXT_ZOOM_MAX, Math.max(TEXT_ZOOM_MIN, getTextZoom() + delta));
  localStorage.setItem(TEXT_ZOOM_KEY, String(next));
  applyTextZoom();
}

const SESSION_KEY = 'prelimsify_active_test_v1';
let restoringSession = false;
let restoredAnswers = {};
let paletteCurrentIndex = 0;
let visitedQuestions = new Set();
let markedQuestions = new Set();
let selectedAnswers = {};

function saveTestSession(){
  if (!testStarted || submitted || !Array.isArray(currentData) || !currentData.some(item => item.q)) return;
  const answers = {};
  document.querySelectorAll('.qcard').forEach((card, idx) => {
    const picked = card.querySelector('.opt[data-picked="1"]');
    if (picked) answers[idx + 1] = picked.dataset.letter;
  });
  try{
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      active: true,
      currentData,
      markCorrect: MARK_CORRECT,
      markWrong: MARK_WRONG,
      passMark: PASS_MARK,
      remaining,
      paused: testPaused,
      answers,
      visited: [...visitedQuestions],
      marked: [...markedQuestions],
      currentQuestionIndex: paletteCurrentIndex,
      timeLimitMins: Math.max(1, Number(document.getElementById('timeLimitInput').value) || 120),
      savedAt: Date.now()
    }));
  }catch(e){ console.warn('Could not save test session:', e); }
}

function clearTestSession(){
  try{ sessionStorage.removeItem(SESSION_KEY); }catch(e){}
}

function restoreTestSession(){
  try{
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const state = JSON.parse(raw);
    if (!state || !state.active || !Array.isArray(state.currentData) || !state.currentData.some(item => item.q)) return false;
    validateData(state.currentData);
    currentData = state.currentData;
    MARK_CORRECT = Number(state.markCorrect ?? 2);
    MARK_WRONG = Number(state.markWrong ?? -0.66);
    PASS_MARK = Number(state.passMark ?? 120);
    remaining = Math.max(0, Number(state.remaining) || 0);
    testPaused = !!state.paused;
    restoredAnswers = state.answers || {};
    selectedAnswers = {...restoredAnswers};
    visitedQuestions = new Set(Array.isArray(state.visited) ? state.visited.map(Number) : []);
    markedQuestions = new Set(Array.isArray(state.marked) ? state.marked.map(Number) : []);
    paletteCurrentIndex = Math.max(0, Number(state.currentQuestionIndex) || 0);
    restoringSession = true;
    testStarted = true;
    setTestPaletteVisibility(true);
    document.getElementById('homeScreen').style.display = 'none';
    document.getElementById('appShell').classList.add('active');
    document.getElementById('timeLimitInput').value = Math.max(1, Number(state.timeLimitMins) || 120);
    document.getElementById('markCorrectInput').value = MARK_CORRECT;
    document.getElementById('markWrongInput').value = MARK_WRONG;
    document.getElementById('passMarkInput').value = PASS_MARK;
    buildQuiz(true);
    restoringSession = false;
    restoredAnswers = {};
    return true;
  }catch(e){
    console.warn('Could not restore test session:', e);
    clearTestSession();
    restoringSession = false;
    restoredAnswers = {};
    return false;
  }
}

function setTestPaletteVisibility(show){
  const palette = document.getElementById('questionPalette');
  const layout = document.querySelector('.test-layout');
  if (palette) palette.style.display = show ? '' : 'none';
  if (layout) layout.classList.toggle('test-active', !!show);
}

async function showTest(){
  testStarted = true;
  setTestPaletteVisibility(true);
  testPaused = false;
  paletteCurrentIndex = 0;
  visitedQuestions = new Set([0]);
  markedQuestions = new Set();
  selectedAnswers = {};
  document.getElementById('homeScreen').style.display = 'none';
  document.getElementById('appShell').classList.add('active');
  window.scrollTo(0, 0);
  clearTestSession();
  buildQuiz(false);
  // Start Test is a user gesture, so it is safe to request native fullscreen here.
  // This makes the whole website (including the question-paper loader) use the monitor.
  try {
    if (!document.fullscreenElement) {
      const rootEl = document.documentElement;
      if (rootEl.requestFullscreen) await rootEl.requestFullscreen({navigationUI:'hide'});
      else if (rootEl.webkitRequestFullscreen) rootEl.webkitRequestFullscreen();
    }
  } catch (err) {
    console.warn('Could not enter native fullscreen:', err);
  }
}

function showHome(){
  setTestPaletteVisibility(false);
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  testStarted = false;
  testPaused = false;
  clearTestSession();
  document.getElementById('appShell').classList.remove('active');
  document.getElementById('homeScreen').style.display = 'flex';
  document.getElementById('resultOverlay').classList.remove('open');
  window.scrollTo(0, 0);
}

function exitTestToUploadPage(){
  setTestPaletteVisibility(false);
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  testStarted = false;
  testPaused = false;
  submitted = false;
  timeUp = false;
  clearTestSession();

  currentData = [];
  paletteCurrentIndex = 0;
  visitedQuestions = new Set();
  markedQuestions = new Set();
  selectedAnswers = {};
  document.getElementById('homeScreen').style.display = 'none';
  document.getElementById('appShell').classList.add('active');
  document.getElementById('resultOverlay').classList.remove('open');
  buildQuiz(false);

  // Open the question-paper upload/selection panel immediately.
  const loaderBody = document.getElementById('loaderBody');
  if (loaderBody) loaderBody.classList.add('open');
  window.scrollTo({top:0, behavior:'smooth'});
  setLoaderMsg('Test exited. Choose or upload a question set to start a new test.', true);
}


function updatePauseUI(){
  const overlay = document.getElementById('pauseOverlay');
  const pauseBtn = document.getElementById('pauseBtn');
  const scorebar = document.querySelector('.scorebar');
  if (overlay){
    overlay.classList.toggle('open', testPaused);
    overlay.setAttribute('aria-hidden', testPaused ? 'false' : 'true');
  }
  if (pauseBtn){
    pauseBtn.textContent = testPaused ? 'Resume' : 'Pause';
    pauseBtn.setAttribute('aria-pressed', testPaused ? 'true' : 'false');
  }
  if (scorebar) scorebar.classList.toggle('test-paused', testPaused);
}

function pauseTest(){
  if (!testStarted || submitted || timeUp || testPaused) return;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  testPaused = true;
  saveTestSession();
  updatePauseUI();
}

function resumeTest(){
  if (!testStarted || submitted || timeUp || !testPaused) return;
  testPaused = false;
  updatePauseUI();
  startTimer();
}

function togglePauseTest(){
  if (testPaused) resumeTest();
  else pauseTest();
}

function resetTest(){
  if (!testStarted) return;
  if (!confirm('Reset this test? All answers and your current score will be cleared.')) return;

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;

  const mins = Math.max(1, Number(document.getElementById('timeLimitInput').value) || 120);
  remaining = Math.round(mins * 60);
  timeUp = false;
  testPaused = false;
  submitted = false;
  clearTestSession();
  paletteCurrentIndex = 0;
  visitedQuestions = new Set([0]);
  markedQuestions = new Set();
  selectedAnswers = {};
  buildQuiz(false);
  window.scrollTo(0, 0);
}


const root = document.getElementById('quizRoot');
const savePaperBtn = document.getElementById('savePaperBtn');
if (savePaperBtn) savePaperBtn.addEventListener('click', saveCurrentQuestionSet);



function projectPreview(paper){
  const first = paper && paper.questions && paper.questions[0];
  return first ? String(first.q || '').replace(/\s+/g, ' ').trim() : 'Question set';
}

async function loadSavedProjects(){
  if (!supabaseClient || !supabaseUser) return;

  try{
    const { data, error } = await supabaseClient
      .from(SAVED_PROJECTS_TABLE)
      .select('id,user_id,project_number,paper,saved_at')
      .eq('user_id', supabaseUser.id)
      .order('project_number', { ascending:true });

    if (error) throw error;
    savedProjects = data || [];
    renderSavedProjects();
  }catch(e){
    console.error('Could not load saved projects:', e);
    setLoaderMsg('Could not load saved projects: ' + (e.message || e), false);
  }
}

function makeProjectPaper(){
  return {
    source: 'prelimsify-default-v1',
    title: document.getElementById('titleText')?.textContent || 'Question Set',
    questions: currentData,
    markCorrect: MARK_CORRECT,
    markWrong: MARK_WRONG,
    passMark: PASS_MARK,
    timeLimitMins: Math.max(1, Number(document.getElementById('timeLimitInput').value) || 120)
  };
}

function applyProjectPaper(projectPaper){
  const payload = Array.isArray(projectPaper)
    ? { questions: projectPaper }
    : (projectPaper || {});

  const questions = payload.questions || payload.data;
  if (!Array.isArray(questions)) throw new Error('Saved project has no valid question set.');
  validateData(questions);

  currentData = questions;
  MARK_CORRECT = Number(payload.markCorrect ?? 2);
  MARK_WRONG = Number(payload.markWrong ?? -0.66);
  PASS_MARK = Number(payload.passMark ?? 120);

  const mins = Number(payload.timeLimitMins ?? 120);
  remaining = Math.round(Math.max(1, mins) * 60);
  document.getElementById('timeLimitInput').value = Math.max(1, mins);
  document.getElementById('markCorrectInput').value = MARK_CORRECT;
  document.getElementById('markWrongInput').value = MARK_WRONG;
  document.getElementById('passMarkInput').value = PASS_MARK;
}

async function saveCurrentQuestionSet(){
  if (!supabaseClient || !supabaseUser){
    setLoaderMsg('Supabase is not connected. Try again after the connection is restored.', false);
    return;
  }
  if (!Array.isArray(currentData) || !currentData.some(item => item.q)){
    setLoaderMsg('There is no question set loaded to save.', false);
    return;
  }

  const defaultName = document.getElementById('titleText')?.textContent?.trim() || 'Question Set';
  const projectName = window.prompt('Name this project:', defaultName);
  if (projectName === null) return;
  const cleanName = projectName.trim();
  if (!cleanName){
    setLoaderMsg('Project name cannot be empty.', false);
    return;
  }

  try{
    const { data: latest, error: latestError } = await supabaseClient
      .from(SAVED_PROJECTS_TABLE)
      .select('project_number')
      .eq('user_id', supabaseUser.id)
      .order('project_number', { ascending:false })
      .limit(1);

    if (latestError) throw latestError;

    const nextProject = latest && latest.length ? Number(latest[0].project_number) + 1 : 1;
    const projectPaper = makeProjectPaper();
    projectPaper.title = cleanName;

    const { data, error } = await supabaseClient
      .from(SAVED_PROJECTS_TABLE)
      .insert({
        user_id: supabaseUser.id,
        project_number: nextProject,
        paper: projectPaper,
        saved_at: new Date().toISOString()
      })
      .select('id,user_id,project_number,paper,saved_at')
      .single();

    if (error) throw error;

    savedProjects.push(data);
    savedProjects.sort((a,b) => a.project_number - b.project_number);
    renderSavedProjects();
    setLoaderMsg(`Project "${cleanName}" saved.`, true);
  }catch(e){
    console.error('Could not save project:', e);
    setLoaderMsg('Could not save project: ' + (e.message || e), false);
  }
}

async function deleteSavedProject(id){
  if (!supabaseClient || !supabaseUser) return;

  try{
    const { error } = await supabaseClient
      .from(SAVED_PROJECTS_TABLE)
      .delete()
      .eq('user_id', supabaseUser.id)
      .eq('id', id);

    if (error) throw error;

    savedProjects = savedProjects.filter(p => p.id !== id);
    renderSavedProjects();
    setLoaderMsg('Project deleted.', true);
  }catch(e){
    setLoaderMsg('Could not delete project: ' + (e.message || e), false);
  }
}

async function renameSavedProject(id){
  if (!supabaseClient || !supabaseUser) return;

  const row = savedProjects.find(p => p.id === id);
  if (!row) return;

  const currentName = row.paper?.title || `Project ${row.project_number}`;
  const newName = window.prompt('Rename this project:', currentName);
  if (newName === null) return;
  const cleanName = newName.trim();
  if (!cleanName){
    setLoaderMsg('Project name cannot be empty.', false);
    return;
  }
  if (cleanName === currentName) return;

  try{
    const updatedPaper = { ...(row.paper || {}), title: cleanName };
    const { data, error } = await supabaseClient
      .from(SAVED_PROJECTS_TABLE)
      .update({ paper: updatedPaper })
      .eq('user_id', supabaseUser.id)
      .eq('id', id)
      .select('id,user_id,project_number,paper,saved_at')
      .single();

    if (error) throw error;

    const index = savedProjects.findIndex(p => p.id === id);
    if (index !== -1) savedProjects[index] = data;
    renderSavedProjects();
    setLoaderMsg(`Project renamed to "${cleanName}".`, true);
  }catch(e){
    console.error('Could not rename project:', e);
    setLoaderMsg('Could not rename project: ' + (e.message || e), false);
  }
}

function renderSavedProjects(){
  const list = document.getElementById('savedList');
  const count = document.getElementById('savedCount');
  if (!list || !count) return;

  const rows = [...savedProjects].sort((a,b) => a.project_number - b.project_number);
  count.textContent = rows.length + (rows.length === 1 ? ' saved' : ' saved');

  if (!rows.length){
    list.innerHTML = '<div class="saved-empty">No saved question sets yet.</div>';
    return;
  }

  list.innerHTML = '';
  rows.forEach(row => {
    const wrap = document.createElement('div');
    wrap.className = 'saved-item';

    const name = document.createElement('div');
    name.className = 'saved-question';
    const title = row.paper?.title || `Project ${row.project_number}`;
    name.textContent = `Project ${row.project_number} — ${title}`;
    name.title = 'Load this question set';
    name.onclick = () => {
      try{
        applyProjectPaper(row.paper);
        testStarted = true;
        testPaused = false;
        submitted = false;
        timeUp = false;
        paletteCurrentIndex = 0;
        visitedQuestions = new Set([0]);
        markedQuestions = new Set();
        selectedAnswers = {};
        clearTestSession();
        setTestPaletteVisibility(true);
        document.getElementById('homeScreen').style.display = 'none';
        document.getElementById('appShell').classList.add('active');
        buildQuiz(false);
        closeLoaderIfOpen();
        window.scrollTo({top:0, behavior:'smooth'});
        setLoaderMsg(`Loaded Project ${row.project_number}.`, true);
      }catch(e){
        setLoaderMsg(`Could not load Project ${row.project_number}: ${e.message || e}`, false);
      }
    };

    const actions = document.createElement('div');
    actions.className = 'saved-actions';

    const rename = document.createElement('button');
    rename.className = 'saved-rename';
    rename.type = 'button';
    rename.textContent = 'Rename';
    rename.onclick = () => renameSavedProject(row.id);

    const del = document.createElement('button');
    del.className = 'saved-delete';
    del.type = 'button';
    del.textContent = 'Delete';
    del.onclick = () => deleteSavedProject(row.id);

    actions.appendChild(rename);
    actions.appendChild(del);
    wrap.appendChild(name);
    wrap.appendChild(actions);
    list.appendChild(wrap);
  });
}

function closeLoaderIfOpen(){
  const body = document.getElementById('loaderBody');
  if (body) body.classList.remove('open');
}

function toggleLoader(){
  document.getElementById('loaderBody').classList.toggle('open');
}

function setLoaderMsg(text, ok){
  const el = document.getElementById('loaderMsg');
  el.textContent = text;
  el.className = 'loader-msg ' + (ok ? 'ok' : 'err');
}

document.getElementById('fileInput').addEventListener('change', function(e){
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev){
    const text = String(ev.target.result || '');
    if (file.name.toLowerCase().endsWith('.hysom')){
      document.getElementById('hysomInput').value = text;
      setLoaderMsg('.hysom file loaded — click "Load .hysom Format" to apply.', true);
    } else {
      document.getElementById('jsonInput').value = text;
      setLoaderMsg('JSON file loaded — click "Load JSON" to apply.', true);
    }
  };
  reader.readAsText(file);
});

function cleanHysomLine(line){
  return String(line || '').replace(/\*\*/g, '').replace(/^[ \t]+|[ \t]+$/g, '');
}

function parseHysom(text){
  const normalized = String(text || '').replace(/\r\n?/g, '\n').trim();
  if (!normalized) throw new Error('Paste a .hysom question set first.');

  // Supported headings: Q1., Q2., ... and numeric headings such as 100., 101., ...
  const starts = [...normalized.matchAll(/(?:^|\n)[ \t]*(?:Q\s*\d+|\d{2,})\.\s*/gi)];
  if (!starts.length) throw new Error('No question headings found. Start questions with Q1. or 1., 100., etc.');

  const questions = [];
  for (let i = 0; i < starts.length; i++) {
    const start = starts[i].index + (starts[i][0].startsWith('\n') ? 1 : 0);
    const end = i + 1 < starts.length ? starts[i + 1].index : normalized.length;
    const heading = starts[i][0].trim();
    const block = normalized.slice(start, end).replace(/^(?:Q\s*\d+|\d{2,})\.\s*/i, '').trim();

    // Accept both "Correct Answer: A. ..." and "Answer: (d) ...".
    const answerMatch = block.match(/(?:^|\n)[ \t]*\*{0,2}(?:Correct Answer|Answer)\s*:\s*(?:\(?([A-Da-d])\)?)(?:\.\s*)?(.*?)\*{0,2}[ \t]*(?=\n|$)/i);
    if (!answerMatch) throw new Error(`Question ${i + 1} (${heading}): missing an Answer/Correct Answer line.`);
    const answer = answerMatch[1].toUpperCase();

    const beforeAnswer = block.slice(0, answerMatch.index).trim();
    // Accept A. / B. / C. / D. and (a) / (b) / (c) / (d).
    const optionMatches = [...beforeAnswer.matchAll(/(?:^|\n)[ \t]*\*{0,2}(?:\(([A-Da-d])\)|([A-Da-d])\.)[ \t]*(.*?)\*{0,2}[ \t]*$/gim)];
    if (optionMatches.length < 2) throw new Error(`Question ${i + 1} (${heading}): could not find answer options A-D.`);

    const firstOptionPos = optionMatches[0].index + (optionMatches[0][0].startsWith('\n') ? 1 : 0);
    let questionText = beforeAnswer.slice(0, firstOptionPos).trim();
    questionText = questionText.replace(/^\*+|\*+$/g, '').trim();

    const opts = {};
    optionMatches.forEach(m => {
      const letter = (m[1] || m[2]).toUpperCase();
      opts[letter] = cleanHysomLine(m[3]);
    });

    if (!opts[answer]) throw new Error(`Question ${i + 1} (${heading}): correct answer ${answer} is not one of the options.`);
    questions.push({ q: questionText, o: opts, a: answer });
  }

  validateData(questions);
  return questions;
}

function loadHysomFromTextarea(){
  const raw = document.getElementById('hysomInput').value.trim();
  try{
    const parsed = parseHysom(raw);
    loadQuestionSet(parsed, '.hysom question set loaded');
  }catch(err){
    setLoaderMsg('Could not load .hysom: ' + err.message, false);
  }
}

function loadQuestionSet(parsed, successMessage){
  const mins = parseFloat(document.getElementById('timeLimitInput').value) || 120;
  const mc = parseFloat(document.getElementById('markCorrectInput').value);
  const mw = parseFloat(document.getElementById('markWrongInput').value);
  const pm = parseFloat(document.getElementById('passMarkInput').value);

  MARK_CORRECT = isNaN(mc) ? 2 : mc;
  MARK_WRONG = isNaN(mw) ? -0.66 : mw;
  PASS_MARK = isNaN(pm) ? 120 : pm;
  remaining = Math.round(mins * 60);
  currentData = parsed;
  buildQuiz();
  setLoaderMsg(successMessage + '. Click "Save Current Question Set" if you want to keep it in Saved Projects.', true);
}

function validateData(arr){
  if (!Array.isArray(arr)) throw new Error('Top level must be an array.');
  let qCount = 0;
  arr.forEach((item, i) => {
    if (item.s !== undefined) return;
    if (typeof item.q !== 'string' || !item.o || typeof item.a !== 'string'){
      throw new Error('Item ' + i + ' is missing q, o, or a.');
    }
    if (!item.o[item.a]){
      throw new Error('Item ' + i + ': answer letter "' + item.a + '" not found among its own options.');
    }
    qCount++;
  });
  if (qCount === 0) throw new Error('No valid questions found.');
  return qCount;
}

function loadFromTextarea(){
  const raw = document.getElementById('jsonInput').value.trim();
  if (!raw){ setLoaderMsg('Paste or upload a question set first.', false); return; }

  let parsed;
  try{
    parsed = JSON.parse(raw);
    validateData(parsed);
  }catch(err){
    setLoaderMsg('Could not load: ' + err.message, false);
    return;
  }

  loadQuestionSet(parsed, 'Paper loaded');
}

async function initSupabase(){
  if (!SUPABASE_URL || SUPABASE_URL.includes("YOUR_SUPABASE") ||
      !SUPABASE_PUBLISHABLE_KEY || SUPABASE_PUBLISHABLE_KEY.includes("YOUR_SUPABASE")){
    setLoaderMsg('Supabase is not configured yet. Put your Project URL and Publishable key near the top of this file.', false);
    return false;
  }

  try{
    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      }
    );

    const { data: sessionData, error: sessionError } =
      await supabaseClient.auth.getSession();

    if (sessionError) throw sessionError;

    if (sessionData && sessionData.session){
      supabaseUser = sessionData.session.user;
      return true;
    }

    const { data, error } = await supabaseClient.auth.signInAnonymously();
    if (error) throw error;

    supabaseUser = data.user;
    return !!supabaseUser;
  }catch(e){
    console.error('Supabase initialization failed:', e);
    setLoaderMsg('Supabase connection failed: ' + (e.message || e), false);
    return false;
  }
}

async function moveBuiltInPaperToSavedProjects(){
  if (!supabaseClient || !supabaseUser) return;

  try{
    const defaultQuestions = DEFAULT_DATA;
    const defaultSource = 'prelimsify-default-v1';

    // If the built-in paper is already present, do not create a duplicate.
    const { data: projects, error: projectError } = await supabaseClient
      .from(SAVED_PROJECTS_TABLE)
      .select('id,project_number,paper')
      .eq('user_id', supabaseUser.id)
      .order('project_number', { ascending:true });

    if (projectError) throw projectError;

    const alreadySaved = (projects || []).some(row => row.paper?.source === defaultSource);

    if (!alreadySaved){
      const rows = projects || [];
      const nextProject = rows.length
        ? Math.max(...rows.map(row => Number(row.project_number) || 0)) + 1
        : 1;

      const { error } = await supabaseClient
        .from(SAVED_PROJECTS_TABLE)
        .insert({
          user_id: supabaseUser.id,
          project_number: nextProject,
          paper: {
            source: defaultSource,
            title: 'UPSC CSE Prelims 2027 — Default Paper',
            questions: defaultQuestions,
            markCorrect: 2,
            markWrong: -0.66,
            passMark: 120,
            timeLimitMins: 120
          },
          saved_at: new Date().toISOString()
        });

      if (error) throw error;
    }

    // Stop treating quiz_papers as the active/default paper. If it contains
    // the same built-in data, remove only that built-in copy. Custom data is left untouched.
    const { data: activePaper, error: activeError } = await supabaseClient
      .from('quiz_papers')
      .select('paper')
      .eq('user_id', supabaseUser.id)
      .maybeSingle();

    if (activeError) throw activeError;

    if (activePaper?.paper?.data && JSON.stringify(activePaper.paper.data) === JSON.stringify(defaultQuestions)){
      await supabaseClient
        .from('quiz_papers')
        .delete()
        .eq('user_id', supabaseUser.id);
    }

    await loadSavedProjects();
    setLoaderMsg('Default question set moved to Saved Projects. Select it there to start.', true);
  }catch(e){
    console.error('Could not move default paper to Saved Projects:', e);
    setLoaderMsg('Could not move the default paper to Saved Projects: ' + (e.message || e), false);
  }
}

function buildQuiz(restoreState = false){
  if (timerInterval) clearInterval(timerInterval);
  timeUp = false;
  submitted = false;
  answered = 0;
  correctCount = 0;
  wrongCount = 0;
  marks = 0;
  root.innerHTML = '';
  document.getElementById('timesUpBanner').style.display = 'none';
  document.getElementById('resultOverlay').classList.remove('open');
  document.getElementById('submitBar').style.display = 'none';
  document.getElementById('submitBtn').disabled = true;
  document.getElementById('submitBtn').textContent = 'Submit Paper';
  updatePauseUI();

  if (!Array.isArray(currentData) || !currentData.some(item => item.q) || !testStarted){
    // No active test: hide all test-only UI and leave only the question-set loader.
    setTestPaletteVisibility(false);
    const scorebar = document.querySelector('.scorebar');
    if (scorebar) scorebar.style.display = 'none';
    document.getElementById('totalCount').textContent = '0';
    document.getElementById('maxMarksDisplay').textContent = '0';
    document.getElementById('scoreCount').textContent = '0.00';
    document.getElementById('answeredCount').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    // Keep the question area empty on the Load a question paper page.
    root.innerHTML = '';
    return;
  }


  setTestPaletteVisibility(true);
  const scorebar = document.querySelector('.scorebar');
  if (scorebar) scorebar.style.display = 'flex';
  document.getElementById('submitBar').style.display = 'flex';
  // A real question paper is loaded, so Submit Paper must be active.
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('resetBtnBottom').disabled = false;

  let qNum = 0;
  total = currentData.filter(d => d.q).length;
  if (!restoreState) restoredAnswers = {};
  const maxMarks = total * MARK_CORRECT;
  document.getElementById('totalCount').textContent = total;
  document.getElementById('maxMarksDisplay').textContent = maxMarks;

  currentData.forEach(item => {
    if (item.s){
      const div = document.createElement('div');
      div.className = 'section-divider';
      div.innerHTML = `<span class="label">${item.s}</span><span class="line"></span>`;
      root.appendChild(div);
      return;
    }
    qNum++;
    const card = document.createElement('div');
    card.className = 'qcard';
    const questionIndex = qNum - 1;
    card.dataset.questionIndex = String(questionIndex);
    card.addEventListener('click', (ev) => {
      if (ev.target.closest('button')) return;
      paletteCurrentIndex = questionIndex;
      visitedQuestions.add(questionIndex);
      renderQuestionPalette();
      saveTestSession();
    });

    const head = document.createElement('div');
    head.className = 'qhead';
    head.innerHTML = `<span class="qnum">Q${qNum}.</span><span class="qtext"></span>`;
    head.querySelector('.qtext').textContent = item.q;
    card.appendChild(head);

    const optsWrap = document.createElement('div');
    optsWrap.className = 'options';

    const fb = document.createElement('div');
    fb.className = 'feedback';

    Object.keys(item.o).forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'opt';
      btn.dataset.letter = letter;
      const letterSpan = document.createElement('span');
      letterSpan.className = 'letter';
      letterSpan.textContent = letter + '.';
      btn.appendChild(letterSpan);
      btn.appendChild(document.createTextNode(' ' + item.o[letter]));

      btn.onclick = () => {
        if (btn.classList.contains('locked') || timeUp || submitted) return;
        const allOpts = optsWrap.querySelectorAll('.opt');
        allOpts.forEach(o => o.classList.add('locked', 'dim'));
        btn.classList.remove('dim');
        btn.dataset.picked = '1';
        selectedAnswers[questionIndex] = letter;
        visitedQuestions.add(questionIndex);
        paletteCurrentIndex = questionIndex;

        answered++;
        if (letter === item.a){
          btn.classList.add('correct');
          correctCount++;
          marks += MARK_CORRECT;
          fb.textContent = `Correct. +${MARK_CORRECT.toFixed(2)}`;
          fb.className = 'feedback right';
        } else {
          btn.classList.add('wrong');
          wrongCount++;
          marks += MARK_WRONG;
          allOpts.forEach(o => {
            if (o.dataset.letter === item.a){
              o.classList.remove('dim');
              o.classList.add('correct');
            }
          });
          fb.textContent = `Incorrect — correct answer is ${item.a}. ${MARK_WRONG.toFixed(2)}`;
          fb.className = 'feedback wrong';
        }
        updateScore();
        if (!restoringSession) saveTestSession();
      };
      optsWrap.appendChild(btn);
    });

    if (restoreState && restoredAnswers[qNum]) {
      const letter = restoredAnswers[qNum];
      const picked = optsWrap.querySelector(`.opt[data-letter=\"${letter}\"]`);
      if (picked) {
        picked.dataset.picked = '1';
        picked.classList.add('selected');
        optsWrap.querySelectorAll('.opt').forEach(o => { if (o !== picked) o.classList.add('locked','dim'); });
        selectedAnswers[questionIndex] = letter;
        visitedQuestions.add(questionIndex);
        if (letter === item.a) {
          picked.classList.add('correct');
          fb.textContent = `Correct. +${MARK_CORRECT.toFixed(2)}`;
          fb.className = 'feedback right';
          answered++; correctCount++; marks += MARK_CORRECT;
        } else {
          picked.classList.add('wrong');
          optsWrap.querySelectorAll('.opt').forEach(o => { if (o.dataset.letter === item.a) { o.classList.remove('dim'); o.classList.add('correct'); }});
          fb.textContent = `Incorrect — correct answer is ${item.a}. ${MARK_WRONG.toFixed(2)}`;
          fb.className = 'feedback wrong';
          answered++; wrongCount++; marks += MARK_WRONG;
        }
      }
    }

    const controls = document.createElement('div');
    controls.className = 'question-controls';
    const markBtn = document.createElement('button');
    markBtn.type = 'button';
    markBtn.className = 'question-control mark-review-btn';
    markBtn.textContent = markedQuestions.has(questionIndex) ? 'Unmark for Review' : 'Mark for Review';
    markBtn.addEventListener('click', () => {
      if (markedQuestions.has(questionIndex)) markedQuestions.delete(questionIndex);
      else markedQuestions.add(questionIndex);
      visitedQuestions.add(questionIndex);
      paletteCurrentIndex = questionIndex;
      markBtn.textContent = markedQuestions.has(questionIndex) ? 'Unmark for Review' : 'Mark for Review';
      renderQuestionPalette();
      saveTestSession();
    });
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'question-control clear-response-btn';
    clearBtn.textContent = 'Clear Response';
    clearBtn.addEventListener('click', () => clearQuestionResponse(questionIndex));
    controls.appendChild(markBtn);
    controls.appendChild(clearBtn);

    card.appendChild(optsWrap);
    card.appendChild(fb);
    card.appendChild(controls);
    root.appendChild(card);
  });

  updateScore();
  updatePauseUI();
  if (!testPaused) startTimer();
}

function renderQuestionPalette(){
  const palette = document.getElementById('questionPalette');
  const grid = document.getElementById('questionPaletteGrid');
  if (!palette || !grid) return;
  if (!testStarted || !Array.isArray(currentData) || !currentData.some(item => item.q)) {
    palette.style.display = 'none';
    return;
  }
  palette.style.display = '';
  const cards = [...document.querySelectorAll('.qcard')];
  grid.innerHTML = '';
  cards.forEach((card, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'palette-btn';
    b.textContent = String(i + 1);
    const answeredState = !!selectedAnswers[i] || !!card.querySelector('.opt[data-picked="1"]');
    const markedState = markedQuestions.has(i);
    const visitedState = visitedQuestions.has(i);
    if (answeredState && markedState) b.classList.add('answered-marked');
    else if (answeredState) b.classList.add('answered');
    else if (markedState) b.classList.add('marked');
    else if (!visitedState) b.classList.add('not-visited');
    else b.classList.add('not-answered');
    if (i === paletteCurrentIndex) b.classList.add('current');
    b.title = `Question ${i + 1}`;
    b.addEventListener('click', () => {
      if (testPaused || submitted || timeUp) return;
      paletteCurrentIndex = i;
      visitedQuestions.add(i);
      const target = cards[i];
      if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
      renderQuestionPalette();
      saveTestSession();
    });
    grid.appendChild(b);
  });
}

function clearQuestionResponse(index){
  const cards = [...document.querySelectorAll('.qcard')];
  const card = cards[index];
  if (!card || !selectedAnswers[index]) return;
  const letter = selectedAnswers[index];
  const item = currentData.filter(d => d.q)[index];
  if (letter === item.a){ correctCount--; marks -= MARK_CORRECT; }
  else { wrongCount--; marks -= MARK_WRONG; }
  answered--;
  delete selectedAnswers[index];
  const opts = card.querySelectorAll('.opt');
  opts.forEach(o => {
    o.classList.remove('locked','dim','correct','wrong','selected');
    delete o.dataset.picked;
  });
  const fb = card.querySelector('.feedback');
  if (fb){ fb.textContent = ''; fb.className = 'feedback'; }
  paletteCurrentIndex = index;
  visitedQuestions.add(index);
  updateScore();
  saveTestSession();
}

function updateScore(){
  renderQuestionPalette();
  document.getElementById('answeredCount').textContent = answered;
  document.getElementById('scoreCount').textContent = marks.toFixed(2);
  document.getElementById('progressFill').style.width = (total ? (answered/total*100) : 0) + '%';
}

function formatTime(s){
  const h = Math.floor(s/3600);
  const m = Math.floor((s%3600)/60);
  const sec = s%60;
  return [h,m,sec].map(v => String(v).padStart(2,'0')).join(':');
}

function startTimer(){
  if (testPaused || !testStarted || submitted || timeUp) return;
  if (timerInterval) clearInterval(timerInterval);
  const timerEl = document.getElementById('timerDisplay');
  timerEl.classList.remove('low');
  timerEl.textContent = formatTime(remaining);
  saveTestSession();
  timerInterval = setInterval(() => {
    remaining--;
    if (remaining <= 0){
      remaining = 0;
      timerEl.textContent = formatTime(remaining);
      clearInterval(timerInterval);
      lockPaper();
      finalizeResult('Time is up.');
      return;
    }
    timerEl.textContent = formatTime(remaining);
    saveTestSession();
    if (remaining <= 300){ timerEl.classList.add('low'); }
  }, 1000);
}

function lockPaper(){
  timeUp = true;
  document.querySelectorAll('.opt:not(.locked)').forEach(o => o.classList.add('locked','dim'));
  document.getElementById('timesUpBanner').style.display = 'block';
  document.getElementById('submitBtn').disabled = true;
}

function submitPaper(){
  if (submitted) return;
  submitted = true;
  clearTestSession();
  if (timerInterval) clearInterval(timerInterval);
  document.querySelectorAll('.opt:not(.locked)').forEach(o => o.classList.add('locked','dim'));
  document.getElementById('submitBtn').textContent = 'Submitted';
  document.getElementById('submitBtn').disabled = true;
  finalizeResult(null);
}

function finalizeResult(forcedNote){
  const unanswered = total - answered;
  const maxMarks = total * MARK_CORRECT;
  const card = document.getElementById('resultCard');
  const pass = marks >= PASS_MARK;

  card.className = 'result-card ' + (pass ? 'pass' : 'fail');
  document.getElementById('resultHeading').textContent = forcedNote ? forcedNote : 'Paper submitted';
  document.getElementById('resultMarks').textContent = marks.toFixed(2);
  document.getElementById('resultMarksSub').textContent = 'out of ' + maxMarks + ' (pass mark: ' + PASS_MARK + ')';
  document.getElementById('resultCorrect').textContent = correctCount;
  document.getElementById('resultWrong').textContent = wrongCount;
  document.getElementById('resultUnanswered').textContent = unanswered;

  const msgEl = document.getElementById('resultMsg');
  if (pass){
    msgEl.textContent = "Congratulations! That's a solid score — you're clearing the bar comfortably. Keep this consistency going into the next mock.";
  } else {
    const gap = (PASS_MARK - marks).toFixed(2);
    msgEl.textContent = `Not quite there this time — you're ${gap} marks short of ${PASS_MARK}. That's closeable with focused revision. Look at where the wrong answers came from and go again.`;
  }

  document.getElementById('resultOverlay').classList.add('open');
}

function closeResult(){
  document.getElementById('resultOverlay').classList.remove('open');
}

// UI controls
document.getElementById('startTestBtn').addEventListener('click', showTest);
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
if (zoomInBtn) zoomInBtn.addEventListener('click', () => changeTextZoom(TEXT_ZOOM_STEP));
if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => changeTextZoom(-TEXT_ZOOM_STEP));
applyTextZoom();

document.getElementById('homeBtn').addEventListener('click', showHome);
document.getElementById('pauseBtn').addEventListener('click', togglePauseTest);
document.getElementById('resumeTestBtn').addEventListener('click', resumeTest);
document.getElementById('exitTestBtn').addEventListener('click', exitTestToUploadPage);
document.getElementById('resetBtn').addEventListener('click', resetTest);
document.getElementById('resetBtnBottom').addEventListener('click', resetTest);

// init
(async function init(){
  const connected = await initSupabase();
  if (!connected) return;

  await moveBuiltInPaperToSavedProjects();
  if (!restoreTestSession()) {
    currentData = [];
    testStarted = false;
    setTestPaletteVisibility(false);
    document.getElementById('homeScreen').style.display = 'flex';
    document.getElementById('appShell').classList.remove('active');
    buildQuiz(false);
    const loaderBody = document.getElementById('loaderBody');
    if (loaderBody) loaderBody.classList.add('open');
  }
})();



(function(){
  // F controls TRUE browser fullscreen for the ENTIRE WEBSITE.
  async function toggleSiteFullscreen(){
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      const root = document.documentElement;
      if (root.requestFullscreen) {
        await root.requestFullscreen({ navigationUI: 'hide' });
      } else if (root.webkitRequestFullscreen) {
        root.webkitRequestFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  }

  function syncFullscreenLayout(){
    const active = !!(document.fullscreenElement || document.webkitFullscreenElement);
    document.documentElement.classList.toggle('app-fullscreen', active);
    document.body.classList.toggle('fullscreen-mode', active);
  }

  document.addEventListener('fullscreenchange', syncFullscreenLayout);
  document.addEventListener('webkitfullscreenchange', syncFullscreenLayout);
  syncFullscreenLayout();

  // Native fullscreen requires a user gesture. Enter it on the first
  // interaction anywhere on the site, then F remains the manual toggle.
  let firstInteractionFullscreenTried = false;
  async function enterFullscreenOnFirstInteraction(){
    if (firstInteractionFullscreenTried || document.fullscreenElement) return;
    firstInteractionFullscreenTried = true;
    await toggleSiteFullscreen();
  }

  document.addEventListener('pointerdown', enterFullscreenOnFirstInteraction, { once:true });
  document.addEventListener('keydown', function firstKeyFullscreen(e){
    if (e.key === 'F11' || e.key === 'F5' || e.key === 'Escape') return;
    enterFullscreenOnFirstInteraction();
    document.removeEventListener('keydown', firstKeyFullscreen);
  }, { once:true });

  // F works from every website screen, not only while a test is running.
  // Escape is deliberately left to the browser's native fullscreen behavior.
  document.addEventListener('keydown', function(e){
    const tag = document.activeElement?.tagName;
    const typing = ['INPUT','TEXTAREA','SELECT'].includes(tag);
    if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.altKey && !e.metaKey && !typing) {
      e.preventDefault();
      toggleSiteFullscreen();
    }
  });
})();
