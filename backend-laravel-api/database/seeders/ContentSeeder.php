<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            // ---- Homepage sections ----
            [
                'slug' => 'home-hero',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Open. Interoperable. Inclusive.',
                    'body'    => '<div class="hero-section"><h1>Open. Interoperable. Inclusive.</h1><p class="subtitle">Nepal\'s open payment infrastructure built on the Interledger Protocol</p><p>NIFN connects financial institutions across Nepal into a unified payment network, enabling seamless, low-cost, and inclusive financial services for all.</p><div class="hero-cta"><a href="/join-network" class="btn btn-primary">Join the Network</a><a href="/about" class="btn btn-secondary">Learn More</a></div></div>',
                    'excerpt' => 'Built on the Interledger Protocol - Nepal\'s open payment infrastructure connecting financial institutions across the country.',
                ],
                'ne' => [
                    'title'   => 'खुला। अन्तरसञ्चालन हुने। समावेशी।',
                    'body'    => '<div class="hero-section"><h1>खुला। अन्तरसञ्चालन हुने। समावेशी।</h1><p class="subtitle">इन्टरलेजर प्रोटोकलमा निर्मित नेपालको खुला भुक्तानी पूर्वाधार</p><p>NIFN ले नेपालभरका वित्तीय संस्थाहरूलाई एकीकृत भुक्तानी नेटवर्कमा जोड्दछ, जसले सबैको लागि सहज, कम लागत र समावेशी वित्तीय सेवाहरू सक्षम पार्दछ।</p><div class="hero-cta"><a href="/join-network" class="btn btn-primary">नेटवर्कमा सामेल हुनुहोस्</a><a href="/about" class="btn btn-secondary">थप जानकारी</a></div></div>',
                    'excerpt' => 'इन्टरलेजर प्रोटोकलमा निर्मित - नेपालको खुला भुक्तानी पूर्वाधारले देशभरका वित्तीय संस्थाहरूलाई जोड्दै।',
                ],
            ],
            [
                'slug' => 'home-stats',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Our Impact by Numbers',
                    'body'    => '<div class="stats-section"><div class="stat-item"><span class="stat-number">15+</span><span class="stat-label">Financial Institutions</span></div><div class="stat-item"><span class="stat-number">100K+</span><span class="stat-label">Daily Transactions</span></div><div class="stat-item"><span class="stat-number">60%</span><span class="stat-label">Cost Reduction</span></div><div class="stat-item"><span class="stat-number">500K+</span><span class="stat-label">Citizens Reached</span></div></div>',
                    'excerpt' => 'NIFN\'s impact across Nepal: 15+ financial institutions connected, 100K+ daily transactions, 60% cost reduction, and 500K+ citizens reached.',
                ],
                'ne' => [
                    'title'   => 'संख्यामा हाम्रो प्रभाव',
                    'body'    => '<div class="stats-section"><div class="stat-item"><span class="stat-number">१५+</span><span class="stat-label">वित्तीय संस्थाहरू</span></div><div class="stat-item"><span class="stat-number">१,००,०००+</span><span class="stat-label">दैनिक कारोबार</span></div><div class="stat-item"><span class="stat-number">६०%</span><span class="stat-label">लागत घटाइएको</span></div><div class="stat-item"><span class="stat-number">५,००,०००+</span><span class="stat-label">नागरिकहरूसम्म पुगेको</span></div></div>',
                    'excerpt' => 'NIFN को प्रभाव: १५+ वित्तीय संस्थाहरू जोडिएका, १,००,०००+ दैनिक कारोबार, ६०% लागत घटाइएको, ५,००,०००+ नागरिकहरूसम्म पुगेको।',
                ],
            ],
            [
                'slug' => 'home-features',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Key Features',
                    'body'    => '<div class="features-section"><div class="feature-item"><h3>Interledger Protocol</h3><p>Built on open standards for cross-network payment interoperability.</p></div><div class="feature-item"><h3>Real-Time Settlement</h3><p>Payments settle in seconds, not days, across all connected institutions.</p></div><div class="feature-item"><h3>Low Cost</h3><p>Dramatically reduced transaction costs compared to traditional systems.</p></div><div class="feature-item"><h3>Financial Inclusion</h3><p>Extending payment access to underserved communities across Nepal.</p></div></div>',
                    'excerpt' => 'NIFN key features: Interledger Protocol, real-time settlement, low transaction costs, and financial inclusion for all Nepali citizens.',
                ],
                'ne' => [
                    'title'   => 'मुख्य विशेषताहरू',
                    'body'    => '<div class="features-section"><div class="feature-item"><h3>इन्टरलेजर प्रोटोकल</h3><p>क्रस-नेटवर्क भुक्तानी अन्तरसञ्चालनको लागि खुला मानकहरूमा निर्मित।</p></div><div class="feature-item"><h3>रियल-टाइम सेटलमेन्ट</h3><p>भुक्तानीहरू दिनको सट्टा सेकेन्डमा सेटल हुन्छन्।</p></div><div class="feature-item"><h3>कम लागत</h3><p>परम्परागत प्रणालीको तुलनामा नाटकीय रूपमा कम कारोबार लागत।</p></div><div class="feature-item"><h3>वित्तीय समावेशीकरण</h3><p>नेपालभरका विपन्न समुदायहरूमा भुक्तानी पहुँच विस्तार गर्दै।</p></div></div>',
                    'excerpt' => 'NIFN का मुख्य विशेषताहरू: इन्टरलेजर प्रोटोकल, रियल-टाइम सेटलमेन्ट, कम कारोबार लागत, र सबै नेपाली नागरिकहरूको लागि वित्तीय समावेशीकरण।',
                ],
            ],
            [
                'slug' => 'home-cta',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Ready to Join Nepal\'s Open Payment Network?',
                    'body'    => '<div class="cta-section"><p>Join Nepal\'s leading financial institutions building the future of payments. Whether you\'re a bank, cooperative, fintech, or mobile money provider, NIFN provides the infrastructure you need to offer seamless payment services to your customers.</p><a href="/join-network" class="btn btn-primary btn-lg">Get Started Today</a></div>',
                    'excerpt' => 'Join NIFN and become part of Nepal\'s open payment infrastructure. Connect your institution to a unified payment network.',
                ],
                'ne' => [
                    'title'   => 'नेपालको खुला भुक्तानी नेटवर्कमा सामेल हुन तयार हुनुहुन्छ?',
                    'body'    => '<div class="cta-section"><p>भुक्तानीको भविष्य निर्माण गर्ने नेपालका अग्रणी वित्तीय संस्थाहरूमा सामेल हुनुहोस्। तपाईं बैंक, सहकारी, फिनटेक वा मोबाइल मनी प्रदायक भए पनि, NIFN ले तपाईंको ग्राहकहरूलाई सहज भुक्तानी सेवाहरू प्रदान गर्न आवश्यक पूर्वाधार प्रदान गर्दछ।</p><a href="/join-network" class="btn btn-primary btn-lg">आजै सुरु गर्नुहोस्</a></div>',
                    'excerpt' => 'NIFN मा सामेल हुनुहोस् र नेपालको खुला भुक्तानी पूर्वाधारको हिस्सा बन्नुहोस्। आफ्नो संस्थालाई एकीकृत भुक्तानी नेटवर्कमा जोड्नुहोस्।',
                ],
            ],

            // ---- Content pages ----
            [
                'slug' => 'about',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'About NIFN',
                    'body'    => '<h2>About NIFN</h2><p>Nepal Interledger Financial Network (NIFN) is building open payment infrastructure for Nepal, connecting financial institutions to the global Interledger Protocol network.</p><p>Our mission is to enable seamless, low-cost, and inclusive financial services across Nepal by building a unified payment layer that works across banks, cooperatives, fintechs, and mobile money providers.</p>',
                    'excerpt' => 'Nepal Interledger Financial Network (NIFN) is building open payment infrastructure for Nepal, connecting financial institutions to the global Interledger Protocol network.',
                ],
                'ne' => [
                    'title'   => 'NIFN बारे',
                    'body'    => '<h2>NIFN बारे</h2><p>नेपाल इन्टरलेजर फाइनान्सियल नेटवर्क (NIFN) ले नेपालको लागि खुला भुक्तानी पूर्वाधार निर्माण गर्दैछ, वित्तीय संस्थाहरूलाई ग्लोबल इन्टरलेजर प्रोटोकल नेटवर्कमा जोड्दैछ।</p><p>हाम्रो मिसन बैंक, सहकारी, फिनटेक र मोबाइल मनी प्रदायकहरूमा काम गर्ने एकीकृत भुक्तानी तह निर्माण गरेर नेपालभर सहज, कम लागत र समावेशी वित्तीय सेवाहरू सक्षम पार्नु हो।</p>',
                    'excerpt' => 'नेपाल इन्टरलेजर फाइनान्सियल नेटवर्क (NIFN) ले नेपालको लागि खुला भुक्तानी पूर्वाधार निर्माण गर्दैछ।',
                ],
            ],
            [
                'slug' => 'mission',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Our Mission',
                    'body'    => '<h2>Our Mission</h2><p>NIFN\'s mission is to enable seamless, low-cost, and inclusive financial services across Nepal by building a unified payment layer that works across all financial service providers.</p><ul><li>Connect every financial institution in Nepal</li><li>Reduce transaction costs to near zero</li><li>Enable financial inclusion for underserved communities</li><li>Build on open, interoperable standards</li></ul>',
                    'excerpt' => 'NIFN\'s mission is to enable seamless, low-cost, and inclusive financial services across Nepal through a unified payment layer.',
                ],
                'ne' => [
                    'title'   => 'हाम्रो मिसन',
                    'body'    => '<h2>हाम्रो मिसन</h2><p>NIFN को मिसन सबै वित्तीय सेवा प्रदायकहरूमा काम गर्ने एकीकृत भुक्तानी तह निर्माण गरेर नेपालभर सहज, कम लागत र समावेशी वित्तीय सेवाहरू सक्षम पार्नु हो।</p><ul><li>नेपालका सबै वित्तीय संस्थाहरूलाई जोड्ने</li><li>कारोबार लागतलाई शून्यको नजिक पुर्याउने</li><li>विपन्न समुदायहरूको लागि वित्तीय समावेशीकरण सक्षम पार्ने</li><li>खुला, अन्तरसञ्चालन हुने मानकहरूमा निर्माण गर्ने</li></ul>',
                    'excerpt' => 'NIFN को मिसन एकीकृत भुक्तानी तह निर्माण गरेर नेपालभर सहज, कम लागत र समावेशी वित्तीय सेवाहरू सक्षम पार्नु हो।',
                ],
            ],
            [
                'slug' => 'vision',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Our Vision',
                    'body'    => '<h2>Our Vision</h2><p>A financially inclusive Nepal where every individual and business has access to affordable, reliable, and interoperable digital payment services regardless of their location or the institution they bank with.</p>',
                    'excerpt' => 'A financially inclusive Nepal where every individual and business has access to affordable, reliable, and interoperable digital payment services.',
                ],
                'ne' => [
                    'title'   => 'हाम्रो दृष्टि',
                    'body'    => '<h2>हाम्रो दृष्टि</h2><p>एक वित्तीय रूपमा समावेशी नेपाल जहाँ प्रत्येक व्यक्ति र व्यवसायलाई उनीहरूको स्थान वा बैंकको पर्वाह नगरी किफायती, भरपर्दो र अन्तरसञ्चालन हुने डिजिटल भुक्तानी सेवाहरूमा पहुँच छ।</p>',
                    'excerpt' => 'एक वित्तीय रूपमा समावेशी नेपाल जहाँ प्रत्येक व्यक्ति र व्यवसायलाई डिजिटल भुक्तानी सेवाहरूमा पहुँच छ।',
                ],
            ],
            [
                'slug' => 'impact',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Our Impact',
                    'body'    => '<h2>Our Impact</h2><p>Since our establishment, NIFN has made significant progress in connecting Nepal\'s financial ecosystem.</p><ul><li>Connected 15+ financial institutions</li><li>Enabled 100,000+ daily transactions</li><li>Reduced transaction costs by 60%</li><li>Reached 500,000+ Nepali citizens</li></ul>',
                    'excerpt' => 'NIFN\'s impact: 15+ financial institutions connected, 100K+ daily transactions, 60% cost reduction, reaching 500K+ citizens across Nepal.',
                ],
                'ne' => [
                    'title'   => 'हाम्रो प्रभाव',
                    'body'    => '<h2>हाम्रो प्रभाव</h2><p>हाम्रो स्थापनादेखि, NIFN ले नेपालको वित्तीय इकोसिस्टम जोड्नमा महत्वपूर्ण प्रगति गरेको छ।</p><ul><li>१५+ वित्तीय संस्थाहरू जोडिएका</li><li>१,००,०००+ दैनिक कारोबार</li><li>६०% कारोबार लागत घटाइएको</li><li>५,००,०००+ नेपाली नागरिकहरूसम्म पुगेको</li></ul>',
                    'excerpt' => 'NIFN को प्रभाव: १५+ वित्तीय संस्थाहरू जोडिएका, १,००,०००+ दैनिक कारोबार, ६०% लागत घटाइएको।',
                ],
            ],
            [
                'slug' => 'how-it-works',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'How It Works',
                    'body'    => '<h2>How NIFN Works</h2><p>NIFN uses the Interledger Protocol to connect different financial systems. When a payment is sent, ILP finds the best route across the network, converts currencies as needed, and settles the transaction in seconds.</p><ol><li>User initiates payment from their bank or mobile money account</li><li>NIFN routes the payment through the Interledger Protocol</li><li>The payment is settled in the recipient\'s account in real-time</li></ol>',
                    'excerpt' => 'NIFN uses the Interledger Protocol to connect different financial systems, routing payments across the network for real-time settlement.',
                ],
                'ne' => [
                    'title'   => 'यसरी काम गर्छ',
                    'body'    => '<h2>NIFN यसरी काम गर्छ</h2><p>NIFN ले विभिन्न वित्तीय प्रणालीहरू जोड्न इन्टरलेजर प्रोटोकल प्रयोग गर्दछ। जब भुक्तानी पठाइन्छ, ILP ले नेटवर्कमा उत्तम मार्ग फेला पार्छ, आवश्यक अनुसार मुद्रा रूपान्तरण गर्दछ, र सेकेन्डमा कारोबार सेटल गर्दछ।</p><ol><li>प्रयोगकर्ताले आफ्नो बैंक वा मोबाइल मनी खाताबाट भुक्तानी सुरु गर्दछ</li><li>NIFN ले इन्टरलेजर प्रोटोकल मार्फत भुक्तानी रुट गर्दछ</li><li>भुक्तानी प्राप्तकर्ताको खातामा रियल-टाइममा सेटल हुन्छ</li></ol>',
                    'excerpt' => 'NIFN ले विभिन्न वित्तीय प्रणालीहरू जोड्न इन्टरलेजर प्रोटोकल प्रयोग गर्दछ र सेकेन्डमा कारोबार सेटल गर्दछ।',
                ],
            ],
            [
                'slug' => 'technology',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Technology',
                    'body'    => '<h2>Our Technology</h2><p>NIFN is built on the Interledger Protocol (ILP), an open standard for sending payments across different networks and currencies. We use Rafiki as our core infrastructure for routing payments and managing liquidity.</p><p>Key components include:</p><ul><li>Interledger Protocol (ILP) for cross-network payments</li><li>Rafiki for payment routing and wallet management</li><li>Open Payments API for standardized integration</li><li>Secure multi-currency settlement</li></ul>',
                    'excerpt' => 'NIFN is built on the Interledger Protocol (ILP) using Rafiki for payment routing, with Open Payments API and secure multi-currency settlement.',
                ],
                'ne' => [
                    'title'   => 'प्रविधि',
                    'body'    => '<h2>हाम्रो प्रविधि</h2><p>NIFN इन्टरलेजर प्रोटोकल (ILP) मा निर्मित छ, जुन विभिन्न नेटवर्क र मुद्राहरूमा भुक्तानी पठाउनको लागि खुला मानक हो। हामी भुक्तानी रुटिङ र तरलता व्यवस्थापनको लागि Rafiki लाई हाम्रो मुख्य पूर्वाधारको रूपमा प्रयोग गर्दछौं।</p><p>मुख्य अवयवहरू:</p><ul><li>क्रस-नेटवर्क भुक्तानीको लागि इन्टरलेजर प्रोटोकल (ILP)</li><li>भुक्तानी रुटिङ र वालेट व्यवस्थापनको लागि Rafiki</li><li>मानकीकृत एकीकरणको लागि ओपन पेमेन्ट API</li><li>सुरक्षित बहु-मुद्रा सेटलमेन्ट</li></ul>',
                    'excerpt' => 'NIFN इन्टरलेजर प्रोटोकल (ILP) मा निर्मित छ, जुन विभिन्न नेटवर्क र मुद्राहरूमा भुक्तानी पठाउनको लागि खुला मानक हो।',
                ],
            ],
            [
                'slug' => 'ecosystem',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Ecosystem Overview',
                    'body'    => '<h2>The NIFN Ecosystem</h2><p>Our ecosystem connects banks, cooperatives, fintech companies, and mobile money providers into a unified network for seamless payments and financial inclusion.</p>',
                    'excerpt' => 'The NIFN ecosystem connects banks, cooperatives, fintech companies, and mobile money providers into a unified payment network.',
                ],
                'ne' => [
                    'title'   => 'इकोसिस्टम सिंहावलोकन',
                    'body'    => '<h2>NIFN इकोसिस्टम</h2><p>हाम्रो इकोसिस्टमले बैंक, सहकारी, फिनटेक कम्पनी र मोबाइल मनी प्रदायकहरूलाई सहज भुक्तानी र वित्तीय समावेशीकरणको लागि एकीकृत नेटवर्कमा जोड्दछ।</p>',
                    'excerpt' => 'हाम्रो इकोसिस्टमले बैंक, सहकारी, फिनटेक कम्पनी र मोबाइल मनी प्रदायकहरूलाई एकीकृत नेटवर्कमा जोड्दछ।',
                ],
            ],
            [
                'slug' => 'governance',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Governance',
                    'body'    => '<h2>Governance</h2><p>NIFN operates under a transparent governance model with representation from member institutions, regulators, and civil society. Our governance framework ensures accountability, inclusivity, and long-term sustainability.</p>',
                    'excerpt' => 'NIFN operates under a transparent governance model with representation from member institutions, regulators, and civil society.',
                ],
                'ne' => [
                    'title'   => 'शासन संरचना',
                    'body'    => '<h2>शासन संरचना</h2><p>NIFN सदस्य संस्थाहरू, नियामक निकायहरू र नागरिक समाजको प्रतिनिधित्व सहितको पारदर्शी शासन मोडेल अन्तर्गत सञ्चालन हुन्छ। हाम्रो शासन ढाँचाले जवाफदेहिता, समावेशीकरण र दीर्घकालीन दिगोपन सुनिश्चित गर्दछ।</p>',
                    'excerpt' => 'NIFN सदस्य संस्थाहरू, नियामक निकायहरू र नागरिक समाजको प्रतिनिधित्व सहितको पारदर्शी शासन मोडेल अन्तर्गत सञ्चालन हुन्छ।',
                ],
            ],
            [
                'slug' => 'partners',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Our Partners',
                    'body'    => '<h2>Our Partners</h2><p>NIFN is supported by a growing network of financial institutions, technology partners, and development organizations committed to financial inclusion in Nepal.</p>',
                    'excerpt' => 'NIFN is supported by a growing network of financial institutions, technology partners, and development organizations.',
                ],
                'ne' => [
                    'title'   => 'हाम्रो साझेदार',
                    'body'    => '<h2>हाम्रो साझेदार</h2><p>NIFN नेपालमा वित्तीय समावेशीकरणको लागि प्रतिबद्ध वित्तीय संस्थाहरू, प्रविधि साझेदारहरू र विकास संगठनहरूको बढ्दो नेटवर्कद्वारा समर्थित छ।</p>',
                    'excerpt' => 'NIFN नेपालमा वित्तीय समावेशीकरणको लागि प्रतिबद्ध साझेदारहरूको बढ्दो नेटवर्कद्वारा समर्थित छ।',
                ],
            ],
            [
                'slug' => 'careers',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Careers',
                    'body'    => '<h2>Join Our Team</h2><p>We are looking for passionate individuals to help build the future of payments in Nepal. If you\'re excited about financial inclusion and open technology, we want to hear from you.</p>',
                    'excerpt' => 'Join NIFN and help build the future of payments in Nepal. We\'re looking for passionate individuals excited about financial inclusion.',
                ],
                'ne' => [
                    'title'   => 'करियर',
                    'body'    => '<h2>हाम्रो टोलीमा सामेल हुनुहोस्</h2><p>हामी नेपालमा भुक्तानीको भविष्य निर्माण गर्न मद्दत गर्न जोशिला व्यक्तिहरूको खोजीमा छौं। यदि तपाईं वित्तीय समावेशीकरण र खुला प्रविधिको बारेमा उत्साहित हुनुहुन्छ भने, हामी तपाईंबाट सुन्न चाहन्छौं।</p>',
                    'excerpt' => 'NIFN मा करियर - नेपालमा भुक्तानीको भविष्य निर्माण गर्न हाम्रो टोलीमा सामेल हुनुहोस्।',
                ],
            ],
            [
                'slug' => 'join-network',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Join the Network',
                    'body'    => '<h2>Join the NIFN Network</h2><p>Become part of Nepal\'s open payment infrastructure. Apply to join as a member institution and help us build an inclusive financial ecosystem for all Nepali citizens.</p>',
                    'excerpt' => 'Become part of Nepal\'s open payment infrastructure. Apply to join the NIFN network as a member institution.',
                ],
                'ne' => [
                    'title'   => 'नेटवर्कमा सामेल हुनुहोस्',
                    'body'    => '<h2>NIFN नेटवर्कमा सामेल हुनुहोस्</h2><p>नेपालको खुला भुक्तानी पूर्वाधारको हिस्सा बन्नुहोस्। सदस्य संस्थाको रूपमा सामेल हुन आवेदन दिनुहोस् र सबै नेपाली नागरिकहरूको लागि समावेशी वित्तीय इकोसिस्टम निर्माण गर्न मद्दत गर्नुहोस्।</p>',
                    'excerpt' => 'NIFN नेटवर्कमा सामेल हुनुहोस् र नेपालको खुला भुक्तानी पूर्वाधारको हिस्सा बन्नुहोस्।',
                ],
            ],
            [
                'slug' => 'privacy-policy',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Privacy Policy',
                    'body'    => '<h2>Privacy Policy</h2><p>NIFN is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information when you use our services.</p>',
                    'excerpt' => 'NIFN is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.',
                ],
                'ne' => [
                    'title'   => 'गोपनीयता नीति',
                    'body'    => '<h2>गोपनीयता नीति</h2><p>NIFN तपाईंको गोपनीयताको संरक्षण गर्न प्रतिबद्ध छ। यो नीतिले हामी कसरी तपाईंको व्यक्तिगत जानकारी सङ्कलन, प्रयोग र सुरक्षा गर्छौं भनी व्याख्या गर्दछ।</p>',
                    'excerpt' => 'NIFN तपाईंको गोपनीयताको संरक्षण गर्न प्रतिबद्ध छ। यो नीतिले हामी कसरी तपाईंको जानकारी प्रयोग गर्छौं भनी व्याख्या गर्दछ।',
                ],
            ],
            [
                'slug' => 'terms',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Terms of Service',
                    'body'    => '<h2>Terms of Service</h2><p>By using NIFN services, you agree to these terms. Please read them carefully before proceeding to use our platform and services.</p>',
                    'excerpt' => 'By using NIFN services, you agree to these terms. Please read them carefully before using our platform and services.',
                ],
                'ne' => [
                    'title'   => 'सेवाका सर्तहरू',
                    'body'    => '<h2>सेवाका सर्तहरू</h2><p>NIFN सेवाहरू प्रयोग गरेर, तपाईं यी सर्तहरूसँग सहमत हुनुहुन्छ। कृपया हाम्रो प्लेटफर्म र सेवाहरू प्रयोग गर्नु अघि यिनलाई ध्यानपूर्वक पढ्नुहोस्।</p>',
                    'excerpt' => 'NIFN सेवाहरू प्रयोग गरेर, तपाईं यी सर्तहरूसँग सहमत हुनुहुन्छ। कृपया सेवा प्रयोग गर्नु अघि पढ्नुहोस्।',
                ],
            ],
            [
                'slug' => 'cookie-policy',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Cookie Policy',
                    'body'    => '<h2>Cookie Policy</h2><p>This Cookie Policy explains how NIFN uses cookies and similar tracking technologies to enhance your browsing experience on our website.</p>',
                    'excerpt' => 'This Cookie Policy explains how NIFN uses cookies and similar tracking technologies to enhance your browsing experience.',
                ],
                'ne' => [
                    'title'   => 'कुकी नीति',
                    'body'    => '<h2>कुकी नीति</h2><p>यो कुकी नीतिले NIFN ले तपाईंको ब्राउजिङ अनुभव सुधार गर्न कुकीहरू र समान ट्र्याकिङ प्रविधिहरू कसरी प्रयोग गर्दछ भनी व्याख्या गर्दछ।</p>',
                    'excerpt' => 'यो कुकी नीतिले NIFN ले तपाईंको ब्राउजिङ अनुभव सुधार गर्न कुकीहरू कसरी प्रयोग गर्दछ भनी व्याख्या गर्दछ।',
                ],
            ],
            [
                'slug' => 'contact',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Contact Us',
                    'body'    => '<h2>Contact Us</h2><p>We\'d love to hear from you. Get in touch with the NIFN team.</p>',
                    'excerpt' => 'Have a question or want to learn more? We\'d love to hear from you.',
                ],
                'ne' => [
                    'title'   => 'सम्पर्क गर्नुहोस्',
                    'body'    => '<h2>सम्पर्क गर्नुहोस्</h2><p>हामी तपाईंबाट सुन्न चाहन्छौं। NIFN टोलीसँग सम्पर्क गर्नुहोस्।</p>',
                    'excerpt' => 'कुनै प्रश्न वा थप जान्न चाहनुहुन्छ? हामी तपाईंबाट सुन्न चाहन्छौं।',
                ],
            ],
            [
                'slug' => 'news-hero',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'News & Updates',
                    'body'    => '',
                    'excerpt' => 'Stay informed with the latest news, announcements, and insights from the Nepal Interledger Financial Network.',
                ],
                'ne' => [
                    'title'   => 'समाचार र अपडेट',
                    'body'    => '',
                    'excerpt' => 'नेपाल इन्टरलेजर फाइनान्सियल नेटवर्कबाट नवीनतम समाचार, घोषणाहरू र अन्तर्दृष्टिहरूसँग जानकारी रहनुहोस्।',
                ],
            ],
            [
                'slug' => 'downloads-hero',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Downloads',
                    'body'    => '',
                    'excerpt' => 'Access reports, guides, and resources from NIFN.',
                ],
                'ne' => [
                    'title'   => 'डाउनलोडहरू',
                    'body'    => '',
                    'excerpt' => 'NIFN बाट रिपोर्ट, गाइड र स्रोतहरू पहुँच गर्नुहोस्।',
                ],
            ],
            [
                'slug' => 'gallery-hero',
                'portal_type' => 'website',
                'en' => [
                    'title'   => 'Photo Gallery',
                    'body'    => '',
                    'excerpt' => 'Explore moments from NIFN events, workshops, and community gatherings.',
                ],
                'ne' => [
                    'title'   => 'फोटो ग्यालरी',
                    'body'    => '',
                    'excerpt' => 'NIFN कार्यक्रम, कार्यशाला र सामुदायिक भेलाहरूका क्षणहरू अन्वेषण गर्नुहोस्।',
                ],
            ],

            // ---- Developer pages (English only, for backward compatibility) ----
            ['slug' => 'quick-start',       'portal_type' => 'developer', 'title' => 'Quick Start Guide',           'body' => '<h1>Quick Start</h1><p>Get up and running with the NIFN API in minutes.</p><h2>Prerequisites</h2><ul><li>A registered developer account</li><li>API credentials from the sandbox</li></ul><h2>Installation</h2><pre><code>npm install @nifn/sdk</code></pre>'],
            ['slug' => 'architecture',      'portal_type' => 'developer', 'title' => 'Architecture Overview',       'body' => '<h1>Architecture Overview</h1><p>NIFN is built on the Interledger Protocol (ILP). This document explains the core architectural concepts.</p>'],
            ['slug' => 'open-payments',     'portal_type' => 'developer', 'title' => 'Open Payments API',           'body' => '<h1>Open Payments API</h1><p>The Open Payments API allows you to send and receive payments using the NIFN network.</p>'],
            ['slug' => 'authentication',    'portal_type' => 'developer', 'title' => 'Authentication',              'body' => '<h1>Authentication</h1><p>All API requests must be authenticated using Bearer tokens obtained from the NIFN authorization server.</p>'],
            ['slug' => 'webhooks',          'portal_type' => 'developer', 'title' => 'Webhooks',                    'body' => '<h1>Webhooks</h1><p>NIFN can send webhook notifications to your server when events occur in your account.</p>'],
            ['slug' => 'error-codes',       'portal_type' => 'developer', 'title' => 'Error Codes',                 'body' => '<h1>Error Codes</h1><p>This page documents all error codes returned by the NIFN API.</p>'],
            ['slug' => 'sandbox',           'portal_type' => 'developer', 'title' => 'Sandbox Environment',         'body' => '<h1>Sandbox Environment</h1><p>Test your integration using the NIFN sandbox before going live.</p>'],
            ['slug' => 'sdks',              'portal_type' => 'developer', 'title' => 'SDKs & Libraries',            'body' => '<h1>SDKs & Libraries</h1><p>Official SDKs are available for JavaScript, Python, PHP, and Go.</p>'],
        ];

        $locales = ['en', 'ne'];

        foreach ($pages as $i => $page) {
            $existing = DB::table('contents')->where('slug', $page['slug'])->first();

            if (!$existing) {
                $id = (string) Str::uuid();
                DB::table('contents')->insert([
                    'id'           => $id,
                    'slug'         => $page['slug'],
                    'portal_type'  => $page['portal_type'],
                    'is_published' => true,
                    'sort_order'   => $i,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ]);
            } else {
                $id = $existing->id;
                DB::table('contents')->where('id', $id)->update([
                    'portal_type'  => $page['portal_type'],
                    'is_published' => true,
                    'updated_at'   => now(),
                ]);
            }

            // If the page has locale-specific translations (website pages)
            if (isset($page['en']) && isset($page['ne'])) {
                foreach ($locales as $locale) {
                    $t = $page[$locale];
                    $existingTrans = DB::table('content_translations')
                        ->where('content_id', $id)
                        ->where('locale', $locale)
                        ->first();
                    if ($existingTrans) {
                        DB::table('content_translations')->where('id', $existingTrans->id)->update([
                            'title'           => $t['title'],
                            'body'            => $t['body'],
                            'excerpt'         => $t['excerpt'],
                            'seo_title'       => $t['title'] . ' | NIFN',
                            'seo_description' => $t['excerpt'],
                            'seo_keywords'    => 'NIFN, Nepal, ' . strtolower($page['slug']),
                        ]);
                    } else {
                        DB::table('content_translations')->insert([
                            'id'              => (string) Str::uuid(),
                            'content_id'      => $id,
                            'locale'          => $locale,
                            'title'           => $t['title'],
                            'body'            => $t['body'],
                            'excerpt'         => $t['excerpt'],
                            'seo_title'       => $t['title'] . ' | NIFN',
                            'seo_description' => $t['excerpt'],
                            'seo_keywords'    => 'NIFN, Nepal, ' . strtolower($page['slug']),
                        ]);
                    }
                }
            } else {
                // Legacy developer pages — English only
                $existingTrans = DB::table('content_translations')
                    ->where('content_id', $id)
                    ->where('locale', 'en')
                    ->first();
                if ($existingTrans) {
                    DB::table('content_translations')->where('id', $existingTrans->id)->update([
                        'title'           => $page['title'],
                        'body'            => $page['body'],
                        'excerpt'         => '',
                        'seo_title'       => $page['title'] . ' | NIFN',
                        'seo_description' => substr(strip_tags($page['body']), 0, 160),
                        'seo_keywords'    => 'NIFN, Nepal, ' . strtolower($page['title']),
                    ]);
                } else {
                    DB::table('content_translations')->insert([
                        'id'              => (string) Str::uuid(),
                        'content_id'      => $id,
                        'locale'          => 'en',
                        'title'           => $page['title'],
                        'body'            => $page['body'],
                        'excerpt'         => '',
                        'seo_title'       => $page['title'] . ' | NIFN',
                        'seo_description' => substr(strip_tags($page['body']), 0, 160),
                        'seo_keywords'    => 'NIFN, Nepal, ' . strtolower($page['title']),
                    ]);
                }
            }
        }

        $this->command->info('Content pages seeded successfully.');
    }
}
