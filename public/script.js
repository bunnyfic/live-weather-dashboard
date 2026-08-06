// NOTE: No API key here. All OpenWeatherMap calls go through this app's own
// backend (server.js), which holds the key server-side via .env.
const BASE = "/api";
const PRESET_CITIES = ["Bangalore","Chennai","Mumbai","Delhi","Darjeeling","Kolkata"];
let currentCity = "Bangalore";

// Curated list for local wildcard/substring autocomplete (no extra API calls needed)
const CITY_LIST = [
  // India — South
  "Bangalore,IN","Chennai,IN","Mangalore,IN","Udupi,IN","Mysore,IN","Coimbatore,IN",
  "Kochi,IN","Kozhikode,IN","Thiruvananthapuram,IN","Madurai,IN","Tiruchirappalli,IN",
  "Hyderabad,IN","Visakhapatnam,IN","Vijayawada,IN","Hubli,IN","Belgaum,IN","Shimoga,IN",
  "Hampi,IN","Kannur,IN","Alappuzha,IN","Munnar,IN","Ooty,IN","Pondicherry,IN","Salem,IN",
  "Tirupati,IN","Warangal,IN","Guntur,IN","Davanagere,IN","Bellary,IN",
  // India — West
  "Mumbai,IN","Pune,IN","Ahmedabad,IN","Surat,IN","Vadodara,IN","Goa,IN","Nashik,IN",
  "Rajkot,IN","Nagpur,IN","Aurangabad,IN","Udaipur,IN","Jodhpur,IN","Jaipur,IN",
  "Bikaner,IN","Ajmer,IN","Mount Abu,IN","Alibaug,IN","Lonavala,IN",
  // India — North
  "Delhi,IN","Chandigarh,IN","Shimla,IN","Manali,IN","Dharamshala,IN","Agra,IN",
  "Varanasi,IN","Amritsar,IN","Srinagar,IN","Leh,IN","Rishikesh,IN","Haridwar,IN",
  "Dehradun,IN","Lucknow,IN","Kanpur,IN","Bhopal,IN","Indore,IN","Gwalior,IN",
  "Noida,IN","Gurgaon,IN","Meerut,IN","Jammu,IN",
  // India — East & Northeast
  "Kolkata,IN","Darjeeling,IN","Guwahati,IN","Shillong,IN","Gangtok,IN","Patna,IN",
  "Ranchi,IN","Bhubaneswar,IN","Puri,IN","Siliguri,IN","Imphal,IN","Agartala,IN",
  "Kohima,IN","Itanagar,IN","Jamshedpur,IN","Cuttack,IN",
  // USA
  "New York,US","Los Angeles,US","Chicago,US","San Francisco,US","Miami,US","Seattle,US",
  "Boston,US","Austin,US","Denver,US","Las Vegas,US","San Diego,US","Houston,US",
  "Dallas,US","Atlanta,US","Washington,US","Philadelphia,US","Phoenix,US","Portland,US",
  "Honolulu,US","Orlando,US","Nashville,US","New Orleans,US","Detroit,US","Minneapolis,US",
  // Canada
  "Toronto,CA","Vancouver,CA","Montreal,CA","Calgary,CA","Ottawa,CA","Quebec City,CA",
  // Europe
  "London,GB","Manchester,GB","Edinburgh,GB","Liverpool,GB","Paris,FR","Nice,FR",
  "Lyon,FR","Marseille,FR","Berlin,DE","Munich,DE","Hamburg,DE","Frankfurt,DE",
  "Cologne,DE","Rome,IT","Milan,IT","Venice,IT","Florence,IT","Naples,IT",
  "Madrid,ES","Barcelona,ES","Seville,ES","Valencia,ES","Lisbon,PT","Porto,PT",
  "Amsterdam,NL","Rotterdam,NL","Brussels,BE","Vienna,AT","Salzburg,AT","Zurich,CH",
  "Geneva,CH","Copenhagen,DK","Stockholm,SE","Oslo,NO","Helsinki,FI","Reykjavik,IS",
  "Dublin,IE","Warsaw,PL","Krakow,PL","Prague,CZ","Budapest,HU","Athens,GR",
  "Santorini,GR","Zagreb,HR","Dubrovnik,HR","Bucharest,RO","Kyiv,UA",
  // Middle East
  "Dubai,AE","Abu Dhabi,AE","Doha,QA","Riyadh,SA","Jeddah,SA","Muscat,OM",
  "Manama,BH","Kuwait City,KW","Amman,JO","Beirut,LB","Tel Aviv,IL","Jerusalem,IL",
  // Russia & Central Asia
  "Moscow,RU","Saint Petersburg,RU","Istanbul,TR","Ankara,TR","Cappadocia,TR",
  "Almaty,KZ","Tashkent,UZ",
  // Africa
  "Cairo,EG","Marrakesh,MA","Casablanca,MA","Nairobi,KE","Lagos,NG","Accra,GH",
  "Addis Ababa,ET","Johannesburg,ZA","Cape Town,ZA","Durban,ZA",
  // South America
  "Rio de Janeiro,BR","Sao Paulo,BR","Buenos Aires,AR","Santiago,CL","Lima,PE",
  "Bogota,CO","Cusco,PE","Mexico City,MX","Cancun,MX","Havana,CU",
  // Asia-Pacific
  "Bangkok,TH","Phuket,TH","Chiang Mai,TH","Jakarta,ID","Bali,ID","Manila,PH",
  "Cebu,PH","Kuala Lumpur,MY","Penang,MY","Singapore,SG","Seoul,KR","Busan,KR",
  "Tokyo,JP","Osaka,JP","Kyoto,JP","Sapporo,JP","Beijing,CN","Shanghai,CN",
  "Hong Kong,HK","Taipei,TW","Ho Chi Minh City,VN","Hanoi,VN","Siem Reap,KH",
  "Yangon,MM","Kathmandu,NP","Pokhara,NP","Colombo,LK","Kandy,LK","Male,MV",
  "Dhaka,BD","Islamabad,PK","Karachi,PK","Lahore,PK",
  // Oceania
  "Sydney,AU","Melbourne,AU","Brisbane,AU","Perth,AU","Gold Coast,AU","Adelaide,AU",
  "Auckland,NZ","Wellington,NZ","Queenstown,NZ","Fiji,FJ"


  "Jeju,KR",
  "Incheon,KR",
  "Shenzhen,CN",
  "Guangzhou,CN",
  "Chengdu,CN",
  "Da Nang,VN",
  "Bandung,ID",
  "Surabaya,ID",
  "Johor Bahru,MY",
  "Davao,PH", "Kanhangad,IN", "Ullal,IN"
];

const AQI_META = {
  1:{label:"Good", color:"#EC85AC"},
  2:{label:"Fair", color:"#7FB89A"},
  3:{label:"Moderate", color:"#C79F72"},
  4:{label:"Poor", color:"#A67A4A"},
  5:{label:"Very Poor", color:"#B45B45"}
};

function iconFor(id){
  if(id>=200&&id<300) return "⛈";
  if(id>=300&&id<400) return "🌦";
  if(id>=500&&id<600) return "🌧";
  if(id>=600&&id<700) return "❄";
  if(id>=700&&id<800) return "🌫";
  if(id===800) return "☀";
  if(id>800) return "⛅";
  return "🌤";
}
function fmtTime(unix, tz){
  const d = new Date((unix+tz)*1000);
  let h = d.getUTCHours(), m = d.getUTCMinutes();
  const ampm = h>=12 ? "PM":"AM";
  h = h%12; if(h===0) h=12;
  return `${h}:${m.toString().padStart(2,"0")} ${ampm}`;
}
function uvLabel(uv){
  if(uv==null) return "--";
  if(uv<3) return "Low";
  if(uv<6) return "Moderate";
  if(uv<8) return "High";
  if(uv<11) return "Very High";
  return "Extreme";
}

async function getJSON(url){
  const r = await fetch(url);
  if(!r.ok) throw new Error("HTTP "+r.status);
  return r.json();
}

let lastForecastList = null;

function drawChart(list){
  lastForecastList = list;
  const svg = document.getElementById("chartSvg");
  const pts = list.slice(0,8);
  const temps = pts.map(p=>p.main.temp);
  const min = Math.min(...temps)-1, max = Math.max(...temps)+1;
  const w=320,h=120,pad=18;
  const xStep = (w-2*pad)/(pts.length-1);
  const scaleY = t => h-pad - ( (t-min)/(max-min) )*(h-2*pad);

  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue('--mint').trim() || '#EC85AC';
  const accentFill = styles.getPropertyValue('--mint-light').trim() || '#FBDDE9';
  const labelColor = styles.getPropertyValue('--ink-soft').trim() || '#8A7A66';

  let path = "";
  let dots = "";
  let labels = "";
  pts.forEach((p,i)=>{
    const x = pad + i*xStep;
    const y = scaleY(p.main.temp);
    path += (i===0?"M":"L")+x+","+y+" ";
    dots += `<circle cx="${x}" cy="${y}" r="2.8" fill="${accent}"/>`;
    const hour = new Date(p.dt*1000).getUTCHours();
    labels += `<text x="${x}" y="${h-2}" font-size="8" fill="${labelColor}" text-anchor="middle">${hour}h</text>`;
  });
  svg.innerHTML = `
    <path d="${path}" fill="none" stroke="${accent}" stroke-width="2.5"/>
    <path d="${path} L${pad+(pts.length-1)*xStep},${h-pad} L${pad},${h-pad} Z" fill="${accentFill}"/>
    ${dots}
    ${labels}
  `;
}

function renderAqRing(aqi){
  const meta = AQI_META[aqi] || {label:"--", color:"#8A7A66"};
  const circumference = 264; // 2*pi*42
  const pct = aqi ? aqi/5 : 0;
  const offset = circumference - (circumference*pct);
  const ring = document.getElementById("aqRingProgress");
  ring.setAttribute("stroke", meta.color);
  ring.setAttribute("stroke-dashoffset", offset.toFixed(1));
  const lbl = document.getElementById("aqiLabel");
  lbl.textContent = meta.label;
  lbl.style.color = meta.color;
}

function renderRainDays(list){
  const byDay = {};
  const order = [];
  list.forEach(item=>{
    const date = new Date(item.dt*1000);
    const key = date.toISOString().slice(0,10);
    const pop = item.pop!==undefined ? item.pop : 0;
    if(!(key in byDay)){ byDay[key]=0; order.push(key); }
    byDay[key] = Math.max(byDay[key], pop);
  });
  const days = order.slice(0,4);
  const container = document.getElementById("rainDays");
  container.innerHTML = "";
  days.forEach((key,i)=>{
    const pct = Math.round(byDay[key]*100);
    const dname = i===0 ? "Today" : new Date(key+"T12:00:00").toLocaleDateString(undefined,{weekday:'long'});
    container.innerHTML += `
      <div class="rain-day-row">
        <div class="rain-day-label">${dname}</div>
        <div class="rain-bar-bg">
          <div class="rain-bar-fill" style="width:${pct}%;">${pct>12 ? pct+"%" : ""}</div>
        </div>
        ${pct<=12 ? `<span style="font-size:11px;color:var(--ink-soft);width:34px;">${pct}%</span>` : ""}
      </div>`;
  });
}

function renderLocButtons(){
  const bar = document.getElementById("locBar");
  // remove existing buttons (keep label + search)
  bar.querySelectorAll(".loc-btn").forEach(b=>b.remove());
  const search = bar.querySelector(".loc-search");
  PRESET_CITIES.forEach(city=>{
    const btn = document.createElement("button");
    btn.className = "loc-btn" + (city===currentCity ? " active":"");
    btn.textContent = city;
    btn.onclick = ()=>{ currentCity = city; loadDashboard(); };
    bar.insertBefore(btn, search);
  });
}

async function loadDashboard(){
  renderLocButtons();
  document.getElementById("statusPill").innerHTML = '<span class="dot"></span>Loading '+currentCity+'…';
  try{
    const cur = await getJSON(`${BASE}/weather?city=${encodeURIComponent(currentCity)}`);
    const tz = cur.timezone;

    document.getElementById("cityTitle").textContent = cur.name + " Weather";
    document.getElementById("heroCity").textContent = cur.name + ", " + cur.sys.country;
    document.getElementById("mainTemp").textContent = Math.round(cur.main.temp)+"°C";
    document.getElementById("mainDesc").textContent = cur.weather[0].description;
    document.getElementById("feelsLike").textContent = "Feels like "+Math.round(cur.main.feels_like)+"°C";
    document.getElementById("updatedTime").textContent = "Last updated "+new Date().toLocaleTimeString();
    document.getElementById("tempMin").textContent = Math.round(cur.main.temp_min)+"°";
    document.getElementById("tempMax").textContent = Math.round(cur.main.temp_max)+"°";
    document.getElementById("cloudCover").textContent = cur.clouds.all+"%";
    document.getElementById("statVis").textContent = (cur.visibility/1000).toFixed(2)+" Km";
    document.getElementById("statHum").textContent = cur.main.humidity+"%";
    document.getElementById("statWind").textContent = (cur.wind.speed*3.6).toFixed(1)+" Kph";
    document.getElementById("statPres").textContent = cur.main.pressure+" hPa";
    document.getElementById("statPrecip").textContent = (cur.rain && cur.rain["1h"] ? cur.rain["1h"] : 0).toFixed(2)+" mm";
    document.getElementById("sunrise").textContent = fmtTime(cur.sys.sunrise, tz);
    document.getElementById("sunset").textContent = fmtTime(cur.sys.sunset, tz);
    document.getElementById("statusPill").innerHTML = '<span class="dot"></span>Live · '+currentCity;

    // 5 day / 3h forecast
    const fc = await getJSON(`${BASE}/forecast?city=${encodeURIComponent(currentCity)}`);
    drawChart(fc.list);
    renderRainDays(fc.list);

    const dayMap = {};
    fc.list.forEach(item=>{
      const date = new Date(item.dt*1000);
      const key = date.toISOString().slice(0,10);
      const hour = date.getUTCHours();
      if(!dayMap[key] || Math.abs(hour-12) < Math.abs(dayMap[key].hourDiff)){
        dayMap[key] = {item, hourDiff: Math.abs(hour-12)};
      }
    });
    const todayKey = new Date().toISOString().slice(0,10);
    const days = Object.keys(dayMap).filter(k=>k!==todayKey).slice(0,3);
    const dayRow = document.getElementById("dayRow");
    dayRow.innerHTML = "";
    days.forEach(k=>{
      const it = dayMap[k].item;
      const dname = new Date(it.dt*1000).toLocaleDateString(undefined,{weekday:'long'});
      dayRow.innerHTML += `
        <div class="day-card">
          <div class="d">${dname}</div>
          <div class="ic">${iconFor(it.weather[0].id)}</div>
          <div class="t">${Math.round(it.main.temp)}°C</div>
        </div>`;
        lastWeatherSnapshot = {
      city: cur.name,
      country: cur.sys.country,
      tempC: Math.round(cur.main.temp),
      feelsLikeC: Math.round(cur.main.feels_like),
      description: cur.weather[0].description,
      humidity: cur.main.humidity,
      windKph: (cur.wind.speed*3.6).toFixed(1),
      cloudCoverPct: cur.clouds.all
    };
    });

    // Air quality (via our backend proxy)
    try{
      const aq = await getJSON(`${BASE}/air-pollution?lat=${cur.coord.lat}&lon=${cur.coord.lon}`);
      const comp = aq.list[0].components;
      const aqi = aq.list[0].main.aqi;
      document.getElementById("aqiVal").textContent = aqi;
      renderAqRing(aqi);
      document.getElementById("aqGrid").innerHTML = `
        <div><span class="pill"></span>CO ${comp.co.toFixed(0)}</div>
        <div><span class="pill"></span>SO2 ${comp.so2.toFixed(0)}</div>
        <div><span class="pill"></span>NO2 ${comp.no2.toFixed(0)}</div>
        <div><span class="pill"></span>O3 ${comp.o3.toFixed(0)}</div>
        <div><span class="pill"></span>PM10 ${comp.pm10.toFixed(0)}</div>
        <div><span class="pill"></span>PM2.5 ${comp.pm2_5.toFixed(0)}</div>
      `;
    }catch(e){
      document.getElementById("aqiLabel").textContent = "unavailable";
    }

    // UV Index — free keyless endpoint, safe to call directly from the browser
    try{
      const uv = await getJSON(`https://currentuvindex.com/api/v1/uvi?latitude=${cur.coord.lat}&longitude=${cur.coord.lon}`);
      const val = uv && uv.now ? uv.now.uvi : null;
      document.getElementById("statUv").textContent = val!=null ? val.toFixed(1)+" ("+uvLabel(val)+")" : "N/A";
    }catch(e){
      document.getElementById("statUv").textContent = "N/A";
    }

  }catch(e){
    document.getElementById("statusPill").innerHTML = '<span class="dot" style="background:#c66"></span>Connection issue';
    document.getElementById("mainDesc").innerHTML = `<span class="err">Could not load "${currentCity}" — check spelling, or check your server logs. (${e.message})</span>`;
  }
}

const suggestList = document.getElementById("suggestList");
const cityInput = document.getElementById("customCityInput");
let highlightIdx = -1;
let currentMatches = [];

function showSuggestions(query){
  const q = query.trim().toLowerCase();
  if(!q){ suggestList.classList.remove("open"); suggestList.innerHTML=""; return; }
  // wildcard-style: match anywhere in the city name, not just the start
  currentMatches = CITY_LIST.filter(c => c.toLowerCase().includes(q)).slice(0,8);
  highlightIdx = -1;
  if(currentMatches.length===0){
    suggestList.innerHTML = `<div class="suggest-empty">No matches — press Go to search anyway</div>`;
  }else{
    suggestList.innerHTML = currentMatches.map((c,i)=>{
      const [name, country] = c.split(",");
      return `<div class="suggest-item" data-idx="${i}"><span class="pin">📍</span>${name}<span style="color:var(--ink-soft);margin-left:auto;">${country}</span></div>`;
    }).join("");
  }
  suggestList.classList.add("open");
}

function pickCity(cityStr){
  currentCity = cityStr;
  cityInput.value = cityStr.split(",")[0];
  suggestList.classList.remove("open");
  loadDashboard();
}

cityInput.addEventListener("input", ()=> showSuggestions(cityInput.value));
cityInput.addEventListener("focus", ()=>{ if(cityInput.value.trim()) showSuggestions(cityInput.value); });
document.addEventListener("click", (e)=>{
  if(!e.target.closest(".loc-search")) suggestList.classList.remove("open");
});
suggestList.addEventListener("click", (e)=>{
  const item = e.target.closest(".suggest-item");
  if(item && item.dataset.idx!==undefined && currentMatches[item.dataset.idx]){
    pickCity(currentMatches[item.dataset.idx]);
  }
});
cityInput.addEventListener("keydown", (e)=>{
  const items = suggestList.querySelectorAll(".suggest-item");
  if(e.key==="ArrowDown"){
    e.preventDefault();
    highlightIdx = Math.min(highlightIdx+1, items.length-1);
    items.forEach((it,i)=>it.classList.toggle("hl", i===highlightIdx));
  }else if(e.key==="ArrowUp"){
    e.preventDefault();
    highlightIdx = Math.max(highlightIdx-1, 0);
    items.forEach((it,i)=>it.classList.toggle("hl", i===highlightIdx));
  }else if(e.key==="Enter"){
    if(highlightIdx>=0 && currentMatches[highlightIdx]){
      pickCity(currentMatches[highlightIdx]);
    }else{
      const v = cityInput.value.trim();
      if(v){ currentCity = v; suggestList.classList.remove("open"); loadDashboard(); }
    }
  }else if(e.key==="Escape"){
    suggestList.classList.remove("open");
  }
});
document.getElementById("customCityGo").onclick = ()=>{
  const v = cityInput.value.trim();
  if(v){ currentCity = v; suggestList.classList.remove("open"); loadDashboard(); }
};

loadDashboard();
setInterval(loadDashboard, 10*60*1000);

// ---- Dark mode ----
const themeToggle = document.getElementById("themeToggle");
const rootEl = document.documentElement;

function applyTheme(theme){
  rootEl.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  try{ localStorage.setItem("weatherDashboardTheme", theme); }catch(e){}
  if(lastForecastList) drawChart(lastForecastList);
}

function getInitialTheme(){
  try{
    const saved = localStorage.getItem("weatherDashboardTheme");
    if(saved === "dark" || saved === "light") return saved;
  }catch(e){}
  if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

applyTheme(getInitialTheme());

themeToggle.addEventListener("click", ()=>{
  const next = rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
});
// ---- AI Weather Assistant ----
const aiToggle = document.getElementById("aiToggle");
const aiPanel = document.getElementById("aiPanel");
const aiClose = document.getElementById("aiClose");
const aiMessages = document.getElementById("aiMessages");
const aiInput = document.getElementById("aiInput");
const aiSend = document.getElementById("aiSend");

let aiHistory = []; // [{role:'user'|'assistant', text:'...'}]
let lastWeatherSnapshot = null; // filled in whenever loadDashboard succeeds

function openAiPanel(){
  aiPanel.classList.add("open");
  aiToggle.classList.add("active");
  setTimeout(()=>aiInput.focus(), 150);
}
function closeAiPanel(){
  aiPanel.classList.remove("open");
  aiToggle.classList.remove("active");
}
aiToggle.addEventListener("click", ()=>{
  aiPanel.classList.contains("open") ? closeAiPanel() : openAiPanel();
});
aiClose.addEventListener("click", closeAiPanel);
document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape" && aiPanel.classList.contains("open")) closeAiPanel();
});

function appendAiMessage(text, who){
  const div = document.createElement("div");
  div.className = "ai-msg " + (who === "user" ? "ai-msg-user" : "ai-msg-bot");
  div.textContent = text;
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return div;
}

function showTyping(){
  const div = document.createElement("div");
  div.className = "ai-msg-typing";
  div.id = "aiTypingIndicator";
  div.innerHTML = "<span></span><span></span><span></span>";
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}
function hideTyping(){
  const el = document.getElementById("aiTypingIndicator");
  if(el) el.remove();
}

async function sendAiMessage(){
  const text = aiInput.value.trim();
  if(!text) return;
  aiInput.value = "";
  aiSend.disabled = true;
  appendAiMessage(text, "user");
  aiHistory.push({ role: "user", text });
  showTyping();

  try{
    const r = await fetch("/api/ai-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        history: aiHistory.slice(0, -1), // everything before this turn
        weatherContext: lastWeatherSnapshot
      })
    });
    const data = await r.json();
    hideTyping();
    if(!r.ok) throw new Error(data.error || "Request failed");
    appendAiMessage(data.reply, "bot");
    aiHistory.push({ role: "assistant", text: data.reply });
  }catch(e){
    hideTyping();
    appendAiMessage("Hmm, I couldn't reach the weather brain just now. Try again in a bit!", "bot");
  }finally{
    aiSend.disabled = false;
    aiInput.focus();
  }
}
aiSend.addEventListener("click", sendAiMessage);
aiInput.addEventListener("keydown", (e)=>{
  if(e.key === "Enter") sendAiMessage();
});
