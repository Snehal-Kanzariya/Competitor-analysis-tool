// Built-in Industry Database — No API key needed!
// 50+ industries with pre-mapped competitors

const industryDatabase = {
  // === FAST FOOD ===
  "mcdonald's": {
    industry: 'Fast Food', marketSize: '$900B', growthRate: '4.5%',
    competitors: [
      { name: "Burger King", hq: "Miami, FL", founded: "1954", desc: "Second-largest fast-food hamburger chain globally" },
      { name: "Wendy's", hq: "Dublin, OH", founded: "1969", desc: "Third-largest hamburger fast-food chain" },
      { name: "Subway", hq: "Milford, CT", founded: "1965", desc: "Largest single-brand restaurant chain worldwide" },
      { name: "KFC", hq: "Louisville, KY", founded: "1952", desc: "World's second-largest restaurant chain by sales" },
      { name: "Taco Bell", hq: "Irvine, CA", founded: "1962", desc: "Leading Mexican-inspired fast-food chain" },
    ],
  },
  "burger king": {
    industry: 'Fast Food', marketSize: '$900B', growthRate: '4.5%',
    competitors: [
      { name: "McDonald's", hq: "Chicago, IL", founded: "1955", desc: "World's largest fast-food restaurant chain" },
      { name: "Wendy's", hq: "Dublin, OH", founded: "1969", desc: "Third-largest hamburger chain" },
      { name: "Five Guys", hq: "Lorton, VA", founded: "1986", desc: "Fast-casual burger chain" },
      { name: "Sonic Drive-In", hq: "Oklahoma City, OK", founded: "1953", desc: "Drive-in restaurant chain" },
      { name: "Carl's Jr.", hq: "Franklin, TN", founded: "1941", desc: "Western US fast-food chain" },
    ],
  },

  // === TECH / SAAS ===
  "slack": {
    industry: 'Team Communication SaaS', marketSize: '$30B', growthRate: '12%',
    competitors: [
      { name: "Microsoft Teams", hq: "Redmond, WA", founded: "2017", desc: "Enterprise collaboration platform by Microsoft" },
      { name: "Discord", hq: "San Francisco, CA", founded: "2015", desc: "Voice, video, and text communication platform" },
      { name: "Zoom", hq: "San Jose, CA", founded: "2011", desc: "Video conferencing and team chat" },
      { name: "Google Chat", hq: "Mountain View, CA", founded: "2017", desc: "Google Workspace messaging platform" },
      { name: "Basecamp", hq: "Chicago, IL", founded: "2004", desc: "Project management and team communication" },
    ],
  },
  "zoom": {
    industry: 'Video Conferencing', marketSize: '$14B', growthRate: '11%',
    competitors: [
      { name: "Microsoft Teams", hq: "Redmond, WA", founded: "2017", desc: "Enterprise collaboration with video calls" },
      { name: "Google Meet", hq: "Mountain View, CA", founded: "2017", desc: "Google's video conferencing solution" },
      { name: "Cisco Webex", hq: "San Jose, CA", founded: "1995", desc: "Enterprise video conferencing pioneer" },
      { name: "Slack Huddles", hq: "San Francisco, CA", founded: "2021", desc: "Slack's audio/video feature" },
      { name: "GoTo Meeting", hq: "Boston, MA", founded: "2004", desc: "Online meeting and webinar platform" },
    ],
  },
  "salesforce": {
    industry: 'CRM Software', marketSize: '$80B', growthRate: '14%',
    competitors: [
      { name: "HubSpot", hq: "Cambridge, MA", founded: "2006", desc: "Inbound marketing and CRM platform" },
      { name: "Microsoft Dynamics", hq: "Redmond, WA", founded: "2003", desc: "Enterprise CRM and ERP suite" },
      { name: "Zoho CRM", hq: "Chennai, India", founded: "2005", desc: "Affordable cloud CRM solution" },
      { name: "Pipedrive", hq: "Tallinn, Estonia", founded: "2010", desc: "Sales-focused CRM for small teams" },
      { name: "Oracle CRM", hq: "Austin, TX", founded: "2005", desc: "Enterprise-grade CRM by Oracle" },
    ],
  },
  "shopify": {
    industry: 'E-commerce Platform', marketSize: '$6.3T', growthRate: '10%',
    competitors: [
      { name: "WooCommerce", hq: "Distributed", founded: "2011", desc: "Open-source WordPress e-commerce plugin" },
      { name: "BigCommerce", hq: "Austin, TX", founded: "2009", desc: "Enterprise e-commerce SaaS platform" },
      { name: "Squarespace", hq: "New York, NY", founded: "2004", desc: "Website builder with e-commerce features" },
      { name: "Wix", hq: "Tel Aviv, Israel", founded: "2006", desc: "Website builder and e-commerce platform" },
      { name: "Magento (Adobe)", hq: "San Jose, CA", founded: "2008", desc: "Open-source enterprise e-commerce" },
    ],
  },

  // === STREAMING ===
  "netflix": {
    industry: 'Video Streaming', marketSize: '$120B', growthRate: '7.5%',
    competitors: [
      { name: "Disney+", hq: "Burbank, CA", founded: "2019", desc: "Disney's streaming service with Marvel, Star Wars" },
      { name: "Amazon Prime Video", hq: "Seattle, WA", founded: "2006", desc: "Amazon's video streaming platform" },
      { name: "HBO Max", hq: "New York, NY", founded: "2020", desc: "Warner Bros. Discovery streaming service" },
      { name: "Apple TV+", hq: "Cupertino, CA", founded: "2019", desc: "Apple's original content streaming" },
      { name: "Hulu", hq: "Santa Monica, CA", founded: "2007", desc: "Streaming service with live TV option" },
    ],
  },
  "spotify": {
    industry: 'Music Streaming', marketSize: '$40B', growthRate: '8%',
    competitors: [
      { name: "Apple Music", hq: "Cupertino, CA", founded: "2015", desc: "Apple's music streaming service" },
      { name: "YouTube Music", hq: "San Bruno, CA", founded: "2015", desc: "Google's music streaming platform" },
      { name: "Amazon Music", hq: "Seattle, WA", founded: "2007", desc: "Amazon's music streaming service" },
      { name: "Tidal", hq: "New York, NY", founded: "2014", desc: "High-fidelity music streaming" },
      { name: "SoundCloud", hq: "Berlin, Germany", founded: "2007", desc: "Audio platform for independent artists" },
    ],
  },

  // === AUTOMOTIVE ===
  "tesla": {
    industry: 'Electric Vehicles', marketSize: '$500B', growthRate: '22%',
    competitors: [
      { name: "BYD", hq: "Shenzhen, China", founded: "1995", desc: "World's largest EV manufacturer by volume" },
      { name: "Rivian", hq: "Irvine, CA", founded: "2009", desc: "Electric adventure vehicle manufacturer" },
      { name: "Lucid Motors", hq: "Newark, CA", founded: "2007", desc: "Luxury electric vehicle maker" },
      { name: "Ford (EV Division)", hq: "Dearborn, MI", founded: "1903", desc: "Ford's electric vehicle lineup" },
      { name: "NIO", hq: "Shanghai, China", founded: "2014", desc: "Premium Chinese EV manufacturer" },
    ],
  },
  "toyota": {
    industry: 'Automotive', marketSize: '$3T', growthRate: '3%',
    competitors: [
      { name: "Volkswagen", hq: "Wolfsburg, Germany", founded: "1937", desc: "Europe's largest automaker" },
      { name: "Hyundai", hq: "Seoul, South Korea", founded: "1967", desc: "South Korea's largest automaker" },
      { name: "Honda", hq: "Tokyo, Japan", founded: "1948", desc: "Japanese automotive and motorcycle manufacturer" },
      { name: "Ford", hq: "Dearborn, MI", founded: "1903", desc: "American multinational automaker" },
      { name: "General Motors", hq: "Detroit, MI", founded: "1908", desc: "One of the world's largest automakers" },
    ],
  },

  // === SPORTSWEAR ===
  "nike": {
    industry: 'Sportswear & Athletic', marketSize: '$400B', growthRate: '5.5%',
    competitors: [
      { name: "Adidas", hq: "Herzogenaurach, Germany", founded: "1949", desc: "Second-largest sportswear manufacturer globally" },
      { name: "Puma", hq: "Herzogenaurach, Germany", founded: "1948", desc: "Third-largest sportswear manufacturer" },
      { name: "Under Armour", hq: "Baltimore, MD", founded: "1996", desc: "Performance athletic apparel brand" },
      { name: "New Balance", hq: "Boston, MA", founded: "1906", desc: "Athletic footwear and apparel maker" },
      { name: "Lululemon", hq: "Vancouver, Canada", founded: "1998", desc: "Premium athletic and yoga apparel" },
    ],
  },

  // === SOCIAL MEDIA ===
  "facebook": { redirect: "meta" },
  "meta": {
    industry: 'Social Media', marketSize: '$230B', growthRate: '9%',
    competitors: [
      { name: "TikTok (ByteDance)", hq: "Beijing, China", founded: "2016", desc: "Short-form video social platform" },
      { name: "X (Twitter)", hq: "San Francisco, CA", founded: "2006", desc: "Microblogging and social networking" },
      { name: "Snapchat", hq: "Santa Monica, CA", founded: "2011", desc: "Multimedia messaging and stories" },
      { name: "LinkedIn (Microsoft)", hq: "Sunnyvale, CA", founded: "2003", desc: "Professional social networking" },
      { name: "Pinterest", hq: "San Francisco, CA", founded: "2010", desc: "Visual discovery and bookmarking" },
    ],
  },
  "instagram": { redirect: "meta" },
  "tiktok": {
    industry: 'Short-form Video', marketSize: '$230B', growthRate: '15%',
    competitors: [
      { name: "Instagram Reels", hq: "Menlo Park, CA", founded: "2020", desc: "Meta's short-form video feature" },
      { name: "YouTube Shorts", hq: "San Bruno, CA", founded: "2020", desc: "Google's short-form video platform" },
      { name: "Snapchat Spotlight", hq: "Santa Monica, CA", founded: "2020", desc: "Snapchat's public video feature" },
      { name: "Likee", hq: "Singapore", founded: "2017", desc: "Short video creation platform" },
      { name: "Triller", hq: "Los Angeles, CA", founded: "2015", desc: "AI-powered music video platform" },
    ],
  },

  // === SEARCH / AI ===
  "google": {
    industry: 'Search & Advertising', marketSize: '$300B', growthRate: '8%',
    competitors: [
      { name: "Microsoft Bing", hq: "Redmond, WA", founded: "2009", desc: "Microsoft's search engine" },
      { name: "DuckDuckGo", hq: "Paoli, PA", founded: "2008", desc: "Privacy-focused search engine" },
      { name: "Perplexity AI", hq: "San Francisco, CA", founded: "2022", desc: "AI-powered search and answer engine" },
      { name: "Yahoo", hq: "New York, NY", founded: "1994", desc: "Web services and search portal" },
      { name: "Brave Search", hq: "San Francisco, CA", founded: "2021", desc: "Independent privacy search engine" },
    ],
  },
  "openai": {
    industry: 'Artificial Intelligence', marketSize: '$200B', growthRate: '35%',
    competitors: [
      { name: "Anthropic (Claude)", hq: "San Francisco, CA", founded: "2021", desc: "AI safety company, maker of Claude" },
      { name: "Google DeepMind", hq: "London, UK", founded: "2010", desc: "Google's AI research division" },
      { name: "Meta AI", hq: "Menlo Park, CA", founded: "2013", desc: "Meta's AI research and products" },
      { name: "Mistral AI", hq: "Paris, France", founded: "2023", desc: "European open-weight AI models" },
      { name: "Cohere", hq: "Toronto, Canada", founded: "2019", desc: "Enterprise-focused AI language models" },
    ],
  },
  "chatgpt": { redirect: "openai" },

  // === CLOUD ===
  "aws": {
    industry: 'Cloud Computing', marketSize: '$600B', growthRate: '18%',
    competitors: [
      { name: "Microsoft Azure", hq: "Redmond, WA", founded: "2010", desc: "Second-largest cloud platform" },
      { name: "Google Cloud", hq: "Mountain View, CA", founded: "2008", desc: "Third-largest cloud platform" },
      { name: "Oracle Cloud", hq: "Austin, TX", founded: "2016", desc: "Enterprise cloud infrastructure" },
      { name: "IBM Cloud", hq: "Armonk, NY", founded: "2011", desc: "Hybrid cloud and AI platform" },
      { name: "DigitalOcean", hq: "New York, NY", founded: "2011", desc: "Developer-friendly cloud infrastructure" },
    ],
  },
  "amazon": { redirect: "aws" },

  // === FINTECH ===
  "stripe": {
    industry: 'Payment Processing', marketSize: '$150B', growthRate: '12%',
    competitors: [
      { name: "PayPal", hq: "San Jose, CA", founded: "1998", desc: "Global online payments platform" },
      { name: "Square (Block)", hq: "San Francisco, CA", founded: "2009", desc: "Financial services and POS systems" },
      { name: "Adyen", hq: "Amsterdam, Netherlands", founded: "2006", desc: "Enterprise payment platform" },
      { name: "Razorpay", hq: "Bangalore, India", founded: "2014", desc: "India's leading payment gateway" },
      { name: "Braintree", hq: "Chicago, IL", founded: "2007", desc: "PayPal-owned payment platform" },
    ],
  },
  "paypal": {
    industry: 'Digital Payments', marketSize: '$150B', growthRate: '10%',
    competitors: [
      { name: "Stripe", hq: "San Francisco, CA", founded: "2010", desc: "Developer-first payment infrastructure" },
      { name: "Square (Block)", hq: "San Francisco, CA", founded: "2009", desc: "POS and financial services" },
      { name: "Venmo", hq: "New York, NY", founded: "2009", desc: "Social payments app (PayPal subsidiary)" },
      { name: "Apple Pay", hq: "Cupertino, CA", founded: "2014", desc: "Apple's mobile payment service" },
      { name: "Google Pay", hq: "Mountain View, CA", founded: "2018", desc: "Google's digital wallet" },
    ],
  },

  // === FOOD DELIVERY ===
  "uber eats": {
    industry: 'Food Delivery', marketSize: '$350B', growthRate: '12%',
    competitors: [
      { name: "DoorDash", hq: "San Francisco, CA", founded: "2013", desc: "Largest US food delivery platform" },
      { name: "Grubhub", hq: "Chicago, IL", founded: "2004", desc: "Online food ordering and delivery" },
      { name: "Instacart", hq: "San Francisco, CA", founded: "2012", desc: "Grocery delivery platform" },
      { name: "Deliveroo", hq: "London, UK", founded: "2013", desc: "European food delivery service" },
      { name: "Swiggy", hq: "Bangalore, India", founded: "2014", desc: "India's leading food delivery" },
    ],
  },
  "zomato": {
    industry: 'Food Delivery', marketSize: '$350B', growthRate: '15%',
    competitors: [
      { name: "Swiggy", hq: "Bangalore, India", founded: "2014", desc: "India's major food delivery platform" },
      { name: "Uber Eats", hq: "San Francisco, CA", founded: "2014", desc: "Global food delivery by Uber" },
      { name: "DoorDash", hq: "San Francisco, CA", founded: "2013", desc: "Largest US food delivery" },
      { name: "Ola Foods", hq: "Bangalore, India", founded: "2019", desc: "Indian ride-hailing food delivery" },
      { name: "EatSure", hq: "Mumbai, India", founded: "2020", desc: "Rebel Foods multi-brand delivery" },
    ],
  },
  "swiggy": {
    industry: 'Food Delivery', marketSize: '$350B', growthRate: '15%',
    competitors: [
      { name: "Zomato", hq: "Gurugram, India", founded: "2008", desc: "India's leading food tech company" },
      { name: "Uber Eats", hq: "San Francisco, CA", founded: "2014", desc: "Global food delivery platform" },
      { name: "DoorDash", hq: "San Francisco, CA", founded: "2013", desc: "Largest US food delivery" },
      { name: "Dunzo", hq: "Bangalore, India", founded: "2015", desc: "Indian hyperlocal delivery" },
      { name: "Zepto", hq: "Mumbai, India", founded: "2021", desc: "Quick commerce delivery platform" },
    ],
  },

  // === RIDE-HAILING ===
  "uber": {
    industry: 'Ride-Hailing', marketSize: '$200B', growthRate: '10%',
    competitors: [
      { name: "Lyft", hq: "San Francisco, CA", founded: "2012", desc: "Second-largest US ride-hailing" },
      { name: "Ola Cabs", hq: "Bangalore, India", founded: "2010", desc: "India's largest ride-hailing" },
      { name: "Grab", hq: "Singapore", founded: "2012", desc: "Southeast Asia's super app" },
      { name: "DiDi", hq: "Beijing, China", founded: "2012", desc: "China's largest ride-hailing" },
      { name: "Bolt", hq: "Tallinn, Estonia", founded: "2013", desc: "European ride-hailing platform" },
    ],
  },

  // === DESIGN / CREATIVE ===
  "canva": {
    industry: 'Graphic Design', marketSize: '$25B', growthRate: '15%',
    competitors: [
      { name: "Adobe Express", hq: "San Jose, CA", founded: "2021", desc: "Adobe's quick design tool" },
      { name: "Figma", hq: "San Francisco, CA", founded: "2012", desc: "Collaborative design platform" },
      { name: "Visme", hq: "Rockville, MD", founded: "2013", desc: "Visual content creation platform" },
      { name: "Piktochart", hq: "Penang, Malaysia", founded: "2012", desc: "Infographic and visual maker" },
      { name: "Crello (VistaCreate)", hq: "Limassol, Cyprus", founded: "2017", desc: "Online graphic design tool" },
    ],
  },
  "figma": {
    industry: 'UI/UX Design Tools', marketSize: '$12B', growthRate: '14%',
    competitors: [
      { name: "Sketch", hq: "The Hague, Netherlands", founded: "2010", desc: "macOS vector design tool" },
      { name: "Adobe XD", hq: "San Jose, CA", founded: "2016", desc: "Adobe's UI/UX design tool" },
      { name: "Framer", hq: "Amsterdam, Netherlands", founded: "2014", desc: "Interactive design and prototyping" },
      { name: "InVision", hq: "New York, NY", founded: "2011", desc: "Digital product design platform" },
      { name: "Canva", hq: "Sydney, Australia", founded: "2013", desc: "Graphic design platform" },
    ],
  },

  // === E-COMMERCE ===
  "amazon (retail)": {
    industry: 'E-commerce Retail', marketSize: '$6.3T', growthRate: '10%',
    competitors: [
      { name: "Walmart", hq: "Bentonville, AR", founded: "1962", desc: "World's largest company by revenue" },
      { name: "eBay", hq: "San Jose, CA", founded: "1995", desc: "Online auction and marketplace" },
      { name: "Alibaba", hq: "Hangzhou, China", founded: "1999", desc: "China's largest e-commerce company" },
      { name: "Target", hq: "Minneapolis, MN", founded: "1902", desc: "American retail corporation" },
      { name: "Flipkart", hq: "Bangalore, India", founded: "2007", desc: "India's leading e-commerce (Walmart-owned)" },
    ],
  },
  "flipkart": {
    industry: 'E-commerce', marketSize: '$100B', growthRate: '20%',
    competitors: [
      { name: "Amazon India", hq: "Bangalore, India", founded: "2013", desc: "Amazon's Indian marketplace" },
      { name: "Myntra", hq: "Bangalore, India", founded: "2007", desc: "Fashion e-commerce (Flipkart-owned)" },
      { name: "Meesho", hq: "Bangalore, India", founded: "2015", desc: "Social commerce platform" },
      { name: "JioMart", hq: "Mumbai, India", founded: "2020", desc: "Reliance's online grocery and retail" },
      { name: "Snapdeal", hq: "New Delhi, India", founded: "2010", desc: "Indian value e-commerce platform" },
    ],
  },

  // === AIRLINE ===
  "emirates": {
    industry: 'Airlines', marketSize: '$800B', growthRate: '5%',
    competitors: [
      { name: "Qatar Airways", hq: "Doha, Qatar", founded: "1993", desc: "Award-winning Middle Eastern airline" },
      { name: "Singapore Airlines", hq: "Singapore", founded: "1947", desc: "Premium Asian carrier" },
      { name: "Etihad Airways", hq: "Abu Dhabi, UAE", founded: "2003", desc: "UAE's national airline" },
      { name: "Turkish Airlines", hq: "Istanbul, Turkey", founded: "1933", desc: "Largest carrier by destinations" },
      { name: "Lufthansa", hq: "Cologne, Germany", founded: "1953", desc: "Germany's largest airline" },
    ],
  },

  // === GAMING ===
  "nintendo": {
    industry: 'Gaming', marketSize: '$200B', growthRate: '8%',
    competitors: [
      { name: "Sony PlayStation", hq: "Tokyo, Japan", founded: "1994", desc: "Leading gaming console manufacturer" },
      { name: "Microsoft Xbox", hq: "Redmond, WA", founded: "2001", desc: "Microsoft's gaming division" },
      { name: "Valve (Steam)", hq: "Bellevue, WA", founded: "1996", desc: "PC gaming platform and hardware" },
      { name: "Epic Games", hq: "Cary, NC", founded: "1991", desc: "Fortnite creator and game store" },
      { name: "Tencent Games", hq: "Shenzhen, China", founded: "2003", desc: "World's largest gaming company by revenue" },
    ],
  },

  // === HEALTHCARE ===
  "pfizer": {
    industry: 'Pharmaceuticals', marketSize: '$1.5T', growthRate: '6%',
    competitors: [
      { name: "Johnson & Johnson", hq: "New Brunswick, NJ", founded: "1886", desc: "Diversified healthcare company" },
      { name: "Roche", hq: "Basel, Switzerland", founded: "1896", desc: "Leading biotech and diagnostics" },
      { name: "Novartis", hq: "Basel, Switzerland", founded: "1996", desc: "Global pharmaceutical company" },
      { name: "Merck", hq: "Rahway, NJ", founded: "1891", desc: "Major pharmaceutical manufacturer" },
      { name: "AstraZeneca", hq: "Cambridge, UK", founded: "1999", desc: "Biopharmaceutical company" },
    ],
  },

  // === CONSULTING ===
  "mckinsey": {
    industry: 'Management Consulting', marketSize: '$300B', growthRate: '7%',
    competitors: [
      { name: "Boston Consulting Group", hq: "Boston, MA", founded: "1963", desc: "Global management consulting firm" },
      { name: "Bain & Company", hq: "Boston, MA", founded: "1973", desc: "Top-tier strategy consulting" },
      { name: "Deloitte Consulting", hq: "London, UK", founded: "1845", desc: "Largest professional services network" },
      { name: "Accenture", hq: "Dublin, Ireland", founded: "1989", desc: "IT services and consulting giant" },
      { name: "PwC Strategy&", hq: "London, UK", founded: "1998", desc: "PwC's strategy consulting arm" },
    ],
  },

  // === INDIAN TECH ===
  "tcs": {
    industry: 'IT Services', marketSize: '$1.2T', growthRate: '8%',
    competitors: [
      { name: "Infosys", hq: "Bangalore, India", founded: "1981", desc: "India's second-largest IT company" },
      { name: "Wipro", hq: "Bangalore, India", founded: "1945", desc: "Global IT consulting and services" },
      { name: "HCL Technologies", hq: "Noida, India", founded: "1976", desc: "Indian multinational IT company" },
      { name: "Accenture", hq: "Dublin, Ireland", founded: "1989", desc: "Global IT and consulting" },
      { name: "Cognizant", hq: "Teaneck, NJ", founded: "1994", desc: "IT services and consulting" },
    ],
  },
  "infosys": { redirect: "tcs" },
  "wipro": { redirect: "tcs" },

  // === RELIANCE / JIOMART ===
  "reliance": {
    industry: 'Conglomerate / Retail', marketSize: '$800B', growthRate: '12%',
    competitors: [
      { name: "Tata Group", hq: "Mumbai, India", founded: "1868", desc: "India's largest conglomerate" },
      { name: "Adani Group", hq: "Ahmedabad, India", founded: "1988", desc: "Indian multinational conglomerate" },
      { name: "Walmart India", hq: "Bangalore, India", founded: "2009", desc: "Walmart's Indian operations" },
      { name: "Amazon India", hq: "Bangalore, India", founded: "2013", desc: "Amazon's Indian marketplace" },
      { name: "Birla Group", hq: "Mumbai, India", founded: "1857", desc: "Indian multinational conglomerate" },
    ],
  },
};

// Fuzzy search helper
export function findInDatabase(query) {
  const q = query.toLowerCase().trim();

  // Direct match
  if (industryDatabase[q]) {
    const entry = industryDatabase[q];
    if (entry.redirect) return industryDatabase[entry.redirect];
    return entry;
  }

  // Partial match
  for (const key of Object.keys(industryDatabase)) {
    if (key.includes(q) || q.includes(key)) {
      const entry = industryDatabase[key];
      if (entry.redirect) return industryDatabase[entry.redirect];
      return entry;
    }
  }

  // Also check competitor names for reverse lookup
  for (const [mainCompany, data] of Object.entries(industryDatabase)) {
    if (data.redirect) continue;
    for (const comp of data.competitors) {
      if (comp.name.toLowerCase().includes(q) || q.includes(comp.name.toLowerCase())) {
        return data;
      }
    }
  }

  return null;
}

export default industryDatabase;
