/**
 * SupplyPilot v3.0 — SIAG Complet (Séances 1–5)
 * ============================================================
 * Séance 1-2 : Articles CRUD + Net disponible + Processus UML
 * Séance 3-4 : KPI + TRS + Segmentation ABC/EOQ + Graphiques
 * Séance 5   : Workflow PO intelligent + Garde-fous + Journal
 * ============================================================
 * Stack : React + Recharts — zéro dépendance externe autre
 * Author: SupplyPilot AI · v3.0 · 2026-03-16
 */

const {
  useState, useEffect, useContext, createContext,
  useCallback, useMemo, useRef, useReducer
} = React;

const {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart,
  Line, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, LineChart, AreaChart, Area, ScatterChart,
  Scatter, ZAxis, ReferenceLine
} = Recharts;

// ─────────────────────────────────────────────
// 1. DONNÉES STATIQUES
// ─────────────────────────────────────────────
/* Extrait des 400 SKU (données complètes chargées depuis ITEMS_FULL) */
const ITEMS_FULL = [
  {id:1,sku:"SKU-0001",article:"Max Coupling 032",famille:"MRO",demande:17348,cout_unit:300.78,lead_time:7,stock_secu:427,taux_poss:0.25,cout_cmd:42.27,val_annuelle:5217931,eoq:140,rop:760,stock_physique:760,stock_transit:0,stock_reserve:0,seuil_min:684,couverture:16.0,abc:"A",statut_service:"Conforme",priorite:"Moyenne",politique:"Contrat-cadre + revue mensuelle",economie:420,supplier_id:1,xyz:"X"},
  {id:2,sku:"SKU-0002",article:"Nano Filter 397",famille:"Hydraulique",demande:14179,cout_unit:222.53,lead_time:8,stock_secu:628,taux_poss:0.18,cout_cmd:47.5,val_annuelle:3155253,eoq:183,rop:939,stock_physique:1033,stock_transit:0,stock_reserve:0,seuil_min:845,couverture:26.6,abc:"A",statut_service:"Conforme",priorite:"Moyenne",politique:"Contrat-cadre + revue mensuelle",economie:294,supplier_id:2,xyz:"X"},
  {id:3,sku:"SKU-0003",article:"Nano Bolt 013",famille:"Consommables",demande:15179,cout_unit:205.23,lead_time:3,stock_secu:633,taux_poss:0.28,cout_cmd:63.74,val_annuelle:3115186,eoq:184,rop:758,stock_physique:909,stock_transit:0,stock_reserve:0,seuil_min:682,couverture:21.9,abc:"A",statut_service:"Conforme",priorite:"Moyenne",politique:"Contrat-cadre + revue mensuelle",economie:422,supplier_id:3,xyz:"Y"},
  {id:4,sku:"SKU-0004",article:"Industrial Fuse 357",famille:"Electrique",demande:11809,cout_unit:258.91,lead_time:26,stock_secu:354,taux_poss:0.28,cout_cmd:80.74,val_annuelle:3057468,eoq:162,rop:1195,stock_physique:1554,stock_transit:0,stock_reserve:0,seuil_min:1076,couverture:48.0,abc:"A",statut_service:"Conforme",priorite:"Moyenne",politique:"Contrat-cadre + revue mensuelle",economie:470,supplier_id:4,xyz:"X"},
  {id:5,sku:"SKU-0005",article:"Pro Mask 381",famille:"Mecanique",demande:13333,cout_unit:221.3,lead_time:4,stock_secu:349,taux_poss:0.2,cout_cmd:69.72,val_annuelle:2950593,eoq:205,rop:495,stock_physique:693,stock_transit:0,stock_reserve:0,seuil_min:446,couverture:19.0,abc:"A",statut_service:"Conforme",priorite:"Moyenne",politique:"Contrat-cadre + revue mensuelle",economie:363,supplier_id:1,xyz:"Y"},
  {id:6,sku:"SKU-0006",article:"Premium Valve 342",famille:"Hydraulique",demande:14370,cout_unit:202.71,lead_time:18,stock_secu:672,taux_poss:0.16,cout_cmd:51.61,val_annuelle:2912943,eoq:214,rop:1381,stock_physique:690,stock_transit:0,stock_reserve:0,seuil_min:1243,couverture:17.5,abc:"A",statut_service:"Sous seuil",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:277,supplier_id:2,xyz:"X"},
  {id:7,sku:"SKU-0007",article:"Industrial Kit 089",famille:"MRO",demande:14763,cout_unit:195.42,lead_time:4,stock_secu:366,taux_poss:0.3,cout_cmd:61.13,val_annuelle:2884985,eoq:175,rop:528,stock_physique:317,stock_transit:100,stock_reserve:0,seuil_min:475,couverture:7.8,abc:"A",statut_service:"Sous seuil",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:411,supplier_id:3,xyz:"Z"},
  {id:8,sku:"SKU-0008",article:"Standard Filter 040",famille:"Electrique",demande:15441,cout_unit:186.19,lead_time:29,stock_secu:798,taux_poss:0.16,cout_cmd:40.85,val_annuelle:2874960,eoq:206,rop:2025,stock_physique:1417,stock_transit:200,stock_reserve:200,seuil_min:1822,couverture:33.5,abc:"A",statut_service:"Sous seuil",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:245,supplier_id:4,xyz:"X"},
  {id:9,sku:"SKU-0009",article:"Max Seal 188",famille:"Electrique",demande:10780,cout_unit:264.6,lead_time:23,stock_secu:176,taux_poss:0.28,cout_cmd:47.21,val_annuelle:2852388,eoq:117,rop:855,stock_physique:684,stock_transit:0,stock_reserve:0,seuil_min:770,couverture:23.2,abc:"A",statut_service:"Sous seuil",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:347,supplier_id:1,xyz:"Y"},
  {id:10,sku:"SKU-0010",article:"Standard Film 116",famille:"Electrique",demande:14999,cout_unit:184.03,lead_time:26,stock_secu:214,taux_poss:0.16,cout_cmd:67.93,val_annuelle:2760266,eoq:263,rop:1282,stock_physique:1154,stock_transit:0,stock_reserve:0,seuil_min:1154,couverture:28.1,abc:"A",statut_service:"Conforme",priorite:"Moyenne",politique:"Contrat-cadre + revue mensuelle",economie:310,supplier_id:2,xyz:"X"},
  {id:11,sku:"SKU-0011",article:"Ultra Pump 187",famille:"Mecanique",demande:8824,cout_unit:308.61,lead_time:15,stock_secu:148,taux_poss:0.16,cout_cmd:38.78,val_annuelle:2723175,eoq:118,rop:511,stock_physique:511,stock_transit:0,stock_reserve:0,seuil_min:460,couverture:21.1,abc:"A",statut_service:"Conforme",priorite:"Moyenne",politique:"Contrat-cadre + revue mensuelle",economie:233,supplier_id:3,xyz:"X"},
  {id:12,sku:"SKU-0012",article:"Smart Label 218",famille:"Sécurité",demande:14466,cout_unit:184.04,lead_time:21,stock_secu:623,taux_poss:0.16,cout_cmd:45.07,val_annuelle:2662323,eoq:210,rop:1455,stock_physique:1601,stock_transit:0,stock_reserve:0,seuil_min:1310,couverture:40.4,abc:"A",statut_service:"Conforme",priorite:"Moyenne",politique:"Contrat-cadre + revue mensuelle",economie:248,supplier_id:4,xyz:"Y"},
  {id:13,sku:"SKU-0013",article:"Core Filter 356",famille:"Electrique",demande:13273,cout_unit:198.62,lead_time:23,stock_secu:502,taux_poss:0.16,cout_cmd:30.54,val_annuelle:2636283,eoq:160,rop:1338,stock_physique:0,stock_transit:0,stock_reserve:0,seuil_min:1205,couverture:0,abc:"A",statut_service:"Sous seuil",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:203,supplier_id:1,xyz:"X"},
  {id:14,sku:"SKU-0014",article:"Industrial Carton 105",famille:"Mecanique",demande:15559,cout_unit:169.43,lead_time:9,stock_secu:405,taux_poss:0.22,cout_cmd:40.26,val_annuelle:2636161,eoq:183,rop:789,stock_physique:1025,stock_transit:0,stock_reserve:0,seuil_min:710,couverture:24.0,abc:"A",statut_service:"Conforme",priorite:"Moyenne",politique:"Contrat-cadre + revue mensuelle",economie:273,supplier_id:2,xyz:"Y"},
  {id:15,sku:"SKU-0015",article:"Smart Seal 331",famille:"MRO",demande:12183,cout_unit:207.42,lead_time:22,stock_secu:396,taux_poss:0.2,cout_cmd:36,val_annuelle:2526998,eoq:145,rop:1130,stock_physique:1582,stock_transit:0,stock_reserve:0,seuil_min:1017,couverture:47.4,abc:"A",statut_service:"Conforme",priorite:"Moyenne",politique:"Contrat-cadre + revue mensuelle",economie:241,supplier_id:3,xyz:"X"},
  {id:16,sku:"SKU-0016",article:"Core Cable 077",famille:"Mecanique",demande:9589,cout_unit:251.83,lead_time:14,stock_secu:322,taux_poss:0.18,cout_cmd:42.41,val_annuelle:2414798,eoq:134,rop:690,stock_physique:345,stock_transit:0,stock_reserve:0,seuil_min:621,couverture:13.1,abc:"A",statut_service:"Sous seuil",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:243,supplier_id:4,xyz:"Z"},
  {id:17,sku:"SKU-0017",article:"Nano Relay 060",famille:"Sécurité",demande:10580,cout_unit:221.67,lead_time:34,stock_secu:356,taux_poss:0.18,cout_cmd:44.55,val_annuelle:2345269,eoq:154,rop:1342,stock_physique:805,stock_transit:0,stock_reserve:0,seuil_min:1207,couverture:27.8,abc:"A",statut_service:"Sous seuil",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:245,supplier_id:1,xyz:"X"},
  {id:18,sku:"SKU-0018",article:"Flex Film 019",famille:"Mecanique",demande:16845,cout_unit:137.99,lead_time:31,stock_secu:402,taux_poss:0.25,cout_cmd:51.18,val_annuelle:2324442,eoq:224,rop:1833,stock_physique:1283,stock_transit:0,stock_reserve:0,seuil_min:1649,couverture:27.8,abc:"A",statut_service:"Sous seuil",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:308,supplier_id:2,xyz:"Y"},
  {id:19,sku:"SKU-0019",article:"Nano Carton 374",famille:"Sécurité",demande:14925,cout_unit:147.93,lead_time:33,stock_secu:497,taux_poss:0.25,cout_cmd:74.65,val_annuelle:2207855,eoq:245,rop:1846,stock_physique:1477,stock_transit:0,stock_reserve:0,seuil_min:1662,couverture:36.1,abc:"A",statut_service:"Sous seuil",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:363,supplier_id:3,xyz:"Z"},
  {id:20,sku:"SKU-0020",article:"Smart Relay 231",famille:"Quincaillerie",demande:13102,cout_unit:168.48,lead_time:16,stock_secu:586,taux_poss:0.3,cout_cmd:43.61,val_annuelle:2207425,eoq:150,rop:1160,stock_physique:1044,stock_transit:0,stock_reserve:0,seuil_min:1044,couverture:29.1,abc:"A",statut_service:"Conforme",priorite:"Moyenne",politique:"Contrat-cadre + revue mensuelle",economie:304,supplier_id:5,xyz:"X"},
  {id:30,sku:"SKU-0030",article:"Nano Glove 055",famille:"Sécurité",demande:12682,cout_unit:164.26,lead_time:33,stock_secu:303,taux_poss:0.22,cout_cmd:44.05,val_annuelle:2083145,eoq:176,rop:1450,stock_physique:-435,stock_transit:0,stock_reserve:0,seuil_min:1305,couverture:-12.5,abc:"A",statut_service:"Rupture",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:254,supplier_id:2,xyz:"Z"},
  {id:47,sku:"SKU-0047",article:"Smart Coupling 315",famille:"Electrique",demande:8714,cout_unit:204.89,lead_time:8,stock_secu:163,taux_poss:0.16,cout_cmd:39,val_annuelle:1785411,eoq:144,rop:354,stock_physique:-212,stock_transit:0,stock_reserve:0,seuil_min:319,couverture:-8.9,abc:"A",statut_service:"Rupture",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:189,supplier_id:3,xyz:"Y"},
  {id:81,sku:"SKU-0081",article:"Max Kit 250",famille:"Packaging",demande:8849,cout_unit:152.58,lead_time:28,stock_secu:403,taux_poss:0.18,cout_cmd:55.41,val_annuelle:1350180,eoq:189,rop:1082,stock_physique:-216,stock_transit:0,stock_reserve:0,seuil_min:974,couverture:-8.9,abc:"A",statut_service:"Rupture",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:208,supplier_id:1,xyz:"Z"},
  {id:98,sku:"SKU-0098",article:"Max Glove 080",famille:"Consommables",demande:4532,cout_unit:262.86,lead_time:19,stock_secu:215,taux_poss:0.3,cout_cmd:52.25,val_annuelle:1191282,eoq:77,rop:451,stock_physique:-225,stock_transit:0,stock_reserve:0,seuil_min:406,couverture:-18.1,abc:"A",statut_service:"Rupture",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:244,supplier_id:2,xyz:"Z"},
  {id:149,sku:"SKU-0149",article:"Core Glove 275",famille:"Sécurité",demande:4471,cout_unit:187.87,lead_time:11,stock_secu:235,taux_poss:0.2,cout_cmd:46.24,val_annuelle:839967,eoq:105,rop:370,stock_physique:-148,stock_transit:0,stock_reserve:0,seuil_min:333,couverture:-12.1,abc:"A",statut_service:"Rupture",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:158,supplier_id:1,xyz:"Z"},
  {id:166,sku:"SKU-0166",article:"Smart Kit 053",famille:"Packaging",demande:2942,cout_unit:256.94,lead_time:32,stock_secu:151,taux_poss:0.16,cout_cmd:55.64,val_annuelle:755917,eoq:89,rop:409,stock_physique:-286,stock_transit:0,stock_reserve:0,seuil_min:368,couverture:-35.5,abc:"A",statut_service:"Rupture",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:147,supplier_id:2,xyz:"Z"},
  {id:132,sku:"SKU-0132",article:"Flex Glove 239",famille:"MRO",demande:8522,cout_unit:112.39,lead_time:27,stock_secu:278,taux_poss:0.3,cout_cmd:42.93,val_annuelle:957788,eoq:147,rop:908,stock_physique:-91,stock_transit:0,stock_reserve:0,seuil_min:818,couverture:-3.9,abc:"A",statut_service:"Rupture",priorite:"Haute",politique:"Contrat-cadre + revue mensuelle",economie:199,supplier_id:4,xyz:"Z"},
  {id:200,sku:"SKU-0200",article:"Ultra Kit 095",famille:"MRO",demande:9064,cout_unit:64.63,lead_time:3,stock_secu:208,taux_poss:0.25,cout_cmd:49.48,val_annuelle:585806,eoq:236,rop:282,stock_physique:-85,stock_transit:0,stock_reserve:0,seuil_min:254,couverture:-3.4,abc:"B",statut_service:"Rupture",priorite:"Haute",politique:"Automatiser / EDI",economie:228,supplier_id:5,xyz:"Z"},
  {id:184,sku:"SKU-0184",article:"Standard Kit 246",famille:"Consommables",demande:4130,cout_unit:153.66,lead_time:32,stock_secu:221,taux_poss:0.16,cout_cmd:55.86,val_annuelle:634616,eoq:137,rop:583,stock_physique:758,stock_transit:0,stock_reserve:0,seuil_min:525,couverture:67.0,abc:"B",statut_service:"Conforme",priorite:"Moyenne",politique:"Automatiser / EDI",economie:202,supplier_id:4,xyz:"Y"},
  {id:185,sku:"SKU-0185",article:"Industrial Filter 270",famille:"Electrique",demande:5488,cout_unit:115.27,lead_time:35,stock_secu:95,taux_poss:0.22,cout_cmd:37.03,val_annuelle:632602,eoq:127,rop:621,stock_physique:870,stock_transit:0,stock_reserve:0,seuil_min:559,couverture:57.9,abc:"B",statut_service:"Conforme",priorite:"Moyenne",politique:"Automatiser / EDI",economie:193,supplier_id:1,xyz:"X"},
  {id:295,sku:"SKU-0295",article:"Core Carton 046",famille:"Mecanique",demande:1922,cout_unit:141.76,lead_time:24,stock_secu:93,taux_poss:0.25,cout_cmd:46,val_annuelle:272463,eoq:71,rop:219,stock_physique:307,stock_transit:0,stock_reserve:0,seuil_min:197,couverture:58.3,abc:"C",statut_service:"Conforme",priorite:"Basse",politique:"Consolidation mensuelle / MOQ",economie:250,supplier_id:3,xyz:"Z"},
  {id:300,sku:"SKU-0300",article:"Max Switch 073",famille:"Electrique",demande:4677,cout_unit:55.1,lead_time:20,stock_secu:117,taux_poss:0.25,cout_cmd:62.66,val_annuelle:257703,eoq:206,rop:373,stock_physique:336,stock_transit:0,stock_reserve:0,seuil_min:336,couverture:26.2,abc:"C",statut_service:"Conforme",priorite:"Basse",politique:"Consolidation mensuelle / MOQ",economie:284,supplier_id:5,xyz:"Y"},
].map(i => ({
  ...i,
  stock_net: i.stock_physique + (i.stock_transit||0) - (i.stock_reserve||0),
  msg_reappro: (i.stock_physique + (i.stock_transit||0) - (i.stock_reserve||0)) < i.seuil_min
    ? `⚠ RÉAPPROVISIONNEMENT REQUIS — ${i.article} (${i.sku}) : Net=${i.stock_physique + (i.stock_transit||0) - (i.stock_reserve||0)} < Seuil=${i.seuil_min}. Commander EOQ=${i.eoq} unités.`
    : null
}));

const FAMILLES = ["Electrique","Consommables","Hydraulique","MRO","Mecanique","Packaging","Quincaillerie","Sécurité"];
const ABC_COLORS = {A:"#10B981",B:"#3B82F6",C:"#F59E0B"};
const XYZ_COLORS = {X:"#10B981",Y:"#8B5CF6",Z:"#EF4444"};
const STATUS_COLORS = {"Conforme":"#10B981","Sous seuil":"#F59E0B","Rupture":"#EF4444"};
const PRIO_COLORS = {"Haute":"#EF4444","Moyenne":"#F59E0B","Basse":"#6B7280"};
const PO_STATUS_COLORS = {BROUILLON:"#6B7280",A_VALIDER:"#F59E0B",ENVOYÉ:"#3B82F6",REÇU:"#10B981",CLOS:"#8B5CF6"};
const PO_TRANSITIONS = {
  BROUILLON:{next:"A_VALIDER",label:"Soumettre"},
  A_VALIDER:{next:"ENVOYÉ",label:"Envoyer"},
  ENVOYÉ:{next:"REÇU",label:"Réceptionner"},
  REÇU:{next:"CLOS",label:"Clore"}
};
const ORDINAL_MAPS = {
  priorite:{"Haute":1,"Moyenne":2,"Basse":3},
  statut_service:{"Rupture":1,"Sous seuil":2,"Conforme":3},
  abc:{"A":1,"B":2,"C":3},
  xyz:{"Z":1,"Y":2,"X":3},
  statut:{BROUILLON:1,A_VALIDER:2,ENVOYÉ:3,REÇU:4,CLOS:5},
  level:{CRITICAL:1,ERROR:2,WARNING:3,INFO:4}
};

const SUPPLIERS = [
  {id:1,nom:"TechParts SA",pays:"France",contact:"j.martin@techparts.fr",delai_moyen:8,conformite:94,retard_pct:6,actif:true},
  {id:2,nom:"HydroFluid GmbH",pays:"Allemagne",contact:"k.schmidt@hydrofluid.de",delai_moyen:12,conformite:87,retard_pct:13,actif:true},
  {id:3,nom:"ElectroCorp Ltd",pays:"Royaume-Uni",contact:"p.jones@electrocorp.co.uk",delai_moyen:10,conformite:91,retard_pct:9,actif:true},
  {id:4,nom:"MecaPro SpA",pays:"Italie",contact:"m.rossi@mecapro.it",delai_moyen:14,conformite:78,retard_pct:22,actif:true},
  {id:5,nom:"PackFlow Ltd",pays:"Canada",contact:"c.wong@packflow.ca",delai_moyen:21,conformite:62,retard_pct:38,actif:false}
];

// TRS / KPI Machine data
const TRS_DATA = [
  {mois:"Jan",disponibilite:91.2,performance:88.4,qualite:96.8,trs:77.8,target:80},
  {mois:"Fév",disponibilite:89.7,performance:91.2,qualite:97.1,trs:79.4,target:80},
  {mois:"Mar",disponibilite:93.1,performance:87.6,qualite:95.4,trs:77.8,target:80},
  {mois:"Avr",disponibilite:94.5,performance:90.3,qualite:97.8,trs:83.4,target:80},
  {mois:"Mai",disponibilite:92.8,performance:92.1,qualite:98.2,trs:83.8,target:80},
  {mois:"Jun",disponibilite:88.9,performance:86.4,qualite:94.6,trs:72.7,target:80},
  {mois:"Jul",disponibilite:90.1,performance:88.9,qualite:96.1,trs:76.8,target:80},
  {mois:"Aoû",disponibilite:85.3,performance:83.7,qualite:93.2,trs:66.4,target:80},
  {mois:"Sep",disponibilite:91.7,performance:90.4,qualite:97.4,trs:80.8,target:80},
  {mois:"Oct",disponibilite:93.4,performance:92.8,qualite:98.5,trs:85.4,target:80},
  {mois:"Nov",disponibilite:94.2,performance:91.5,qualite:98.0,trs:84.5,target:80},
  {mois:"Déc",disponibilite:90.8,performance:89.2,qualite:96.7,trs:78.3,target:80},
];

let _poId=21,_taskId=13,_evtId=19;
const genId=p=>{
  if(p==="PO")return`PO-${String(_poId++).padStart(4,"0")}`;
  if(p==="T")return`T-${String(_taskId++).padStart(3,"0")}`;
  return`E-${String(_evtId++).padStart(3,"0")}`;
};

const INITIAL_POS=[
  {id:"PO-0001",sku:"SKU-0012",article:"Pro Switch 286",supplier_id:1,supplier:"TechParts SA",statut:"CLOS",qty:145,prix_negocie:4200,prix_paye:4284,date_creation:"2026-01-05",date_validation:"2026-01-06",date_envoi:"2026-01-08",date_reception:"2026-01-18"},
  {id:"PO-0002",sku:"SKU-0034",article:"Flex Valve 101",supplier_id:2,supplier:"HydroFluid GmbH",statut:"REÇU",qty:183,prix_negocie:8750,prix_paye:8925,date_creation:"2026-01-15",date_validation:"2026-01-16",date_envoi:"2026-01-20",date_reception:"2026-02-01"},
  {id:"PO-0003",sku:"SKU-0056",article:"Smart Sensor 220",supplier_id:3,supplier:"ElectroCorp Ltd",statut:"ENVOYÉ",qty:94,prix_negocie:5320,prix_paye:null,date_creation:"2026-02-01",date_validation:"2026-02-02",date_envoi:"2026-02-05",date_reception:null},
  {id:"PO-0004",sku:"SKU-0078",article:"Industrial Bearing 445",supplier_id:4,supplier:"MecaPro SpA",statut:"A_VALIDER",qty:210,prix_negocie:3180,prix_paye:null,date_creation:"2026-02-10",date_validation:null,date_envoi:null,date_reception:null},
  {id:"PO-0005",sku:"SKU-0092",article:"Ultra Relay 089",supplier_id:1,supplier:"TechParts SA",statut:"BROUILLON",qty:67,prix_negocie:2450,prix_paye:null,date_creation:"2026-02-14",date_validation:null,date_envoi:null,date_reception:null},
  {id:"PO-0006",sku:"SKU-0103",article:"Nano Gasket 334",supplier_id:2,supplier:"HydroFluid GmbH",statut:"BROUILLON",qty:320,prix_negocie:960,prix_paye:null,date_creation:"2026-02-15",date_validation:null,date_envoi:null,date_reception:null},
  {id:"PO-0007",sku:"SKU-0115",article:"Max Motor 178",supplier_id:3,supplier:"ElectroCorp Ltd",statut:"A_VALIDER",qty:52,prix_negocie:9800,prix_paye:null,date_creation:"2026-02-18",date_validation:null,date_envoi:null,date_reception:null},
  {id:"PO-0008",sku:"SKU-0127",article:"Premium Pump 267",supplier_id:4,supplier:"MecaPro SpA",statut:"ENVOYÉ",qty:88,prix_negocie:6720,prix_paye:null,date_creation:"2026-02-20",date_validation:"2026-02-21",date_envoi:"2026-02-23",date_reception:null},
];

const INITIAL_TASKS=[
  {id:"T-001",titre:"Valider PO-0004 — Industrial Bearing 445",type:"Validation PO",assignee:"Marie Lavoie",echeance:"2026-03-17",status:"Ouverte",po_id:"PO-0004"},
  {id:"T-002",titre:"Valider PO-0007 — Max Motor 178",type:"Validation PO",assignee:"Marie Lavoie",echeance:"2026-03-17",status:"Ouverte",po_id:"PO-0007"},
  {id:"T-003",titre:"Audit stock classe A — vérification terrain",type:"Audit",assignee:"Contrôle Stock",echeance:"2026-03-20",status:"Ouverte",po_id:null},
  {id:"T-004",titre:"Mise à jour seuils min post-Q1",type:"Config",assignee:"Gestionnaire Inv.",echeance:"2026-03-31",status:"Ouverte",po_id:null},
  {id:"T-005",titre:"Revue conformité MecaPro SpA",type:"Suivi",assignee:"Marie Lavoie",echeance:"2026-03-12",status:"Ouverte",po_id:null},
  {id:"T-006",titre:"Formation EOQ — équipe terrain",type:"Formation",assignee:"RH",echeance:"2026-04-10",status:"Terminée",po_id:null},
];

const INITIAL_EVENTS=[
  {id:"E-001",date:"2026-03-16 08:12",type:"PO_CREATED",entity:"PO-0008",message:"PO créé pour SKU-0127 — Premium Pump (qty: 88)",level:"INFO"},
  {id:"E-002",date:"2026-03-15 14:35",type:"PO_TRANSITION",entity:"PO-0002",message:"PO-0002 → REÇU depuis ENVOYÉ",level:"INFO"},
  {id:"E-003",date:"2026-03-14 09:20",type:"GARDE_FOU",entity:"SKU-0006",message:"Tentative création PO bloquée — PO ouvert existant pour SKU-0006",level:"WARNING"},
  {id:"E-004",date:"2026-03-12 16:48",type:"RUPTURE",entity:"SKU-0030",message:"Rupture détectée — SKU-0030 stock net ≤ 0",level:"CRITICAL"},
  {id:"E-005",date:"2026-03-11 10:33",type:"GARDE_FOU",entity:"PO-0006",message:"Qty 320 > EOQ×2 — tâche approbation managériale créée",level:"WARNING"},
  {id:"E-006",date:"2026-03-10 08:55",type:"PO_CREATED",entity:"PO-0007",message:"PO créé pour SKU-0115 — Max Motor (qty: 52)",level:"INFO"},
  {id:"E-007",date:"2026-03-09 14:12",type:"PO_TRANSITION",entity:"PO-0002",message:"PO-0002 → REÇU depuis ENVOYÉ",level:"INFO"},
  {id:"E-008",date:"2026-03-05 08:30",type:"RUPTURE",entity:"SKU-0047",message:"Rupture détectée — SKU-0047 stock net < 0",level:"CRITICAL"},
  {id:"E-009",date:"2026-03-03 10:18",type:"GARDE_FOU",entity:"SKU-0200",message:"Fournisseur PackFlow Ltd inactif — création PO bloquée",level:"ERROR"},
];

// ─────────────────────────────────────────────
// 2. THEMES
// ─────────────────────────────────────────────
const THEMES = {
  dark:{
    bg:"#0A0F1E",surface:"#0F1629",card:"#141D32",cardBorder:"#1E2D4A",
    text:"#EEF2FA",textSub:"#7B91B8",textMuted:"#3A4E6B",
    accent:"#3B82F6",accentDim:"rgba(59,130,246,0.12)",
    danger:"#EF4444",warning:"#F59E0B",info:"#06B6D4",purple:"#8B5CF6",
    sidebar:"#080D1A",sidebarBorder:"#131E35",
    inputBg:"#0F1829",inputBorder:"#1E2D4A",
    shadow:"0 4px 24px rgba(0,0,0,0.45)",
    gradient:"linear-gradient(135deg,#3B82F6 0%,#8B5CF6 100%)"
  },
  light:{
    bg:"#F1F5FB",surface:"#FFFFFF",card:"#FFFFFF",cardBorder:"#E2E8F4",
    text:"#0F172A",textSub:"#475569",textMuted:"#94A3B8",
    accent:"#2563EB",accentDim:"rgba(37,99,235,0.08)",
    danger:"#DC2626",warning:"#D97706",info:"#0891B2",purple:"#7C3AED",
    sidebar:"#0F172A",sidebarBorder:"#1E293B",
    inputBg:"#F8FAFD",inputBorder:"#E2E8F4",
    shadow:"0 1px 8px rgba(15,23,42,0.07),0 4px 16px rgba(15,23,42,0.04)",
    gradient:"linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)"
  }
};

// ─────────────────────────────────────────────
// 3. CONTEXTS
// ─────────────────────────────────────────────
const ThemeCtx=createContext(null);
const useTheme=()=>useContext(ThemeCtx);
const DataCtx=createContext(null);
const useData=()=>useContext(DataCtx);

// ─────────────────────────────────────────────
// 4. HOOKS
// ─────────────────────────────────────────────
function useSortable(data,ordMap){
  const [col,setCol]=useState(null);
  const [dir,setDir]=useState("desc");
  const handle=useCallback(c=>{
    setCol(p=>{
      if(p===c){setDir(d=>d==="desc"?"asc":"desc");return c;}
      setDir("desc");return c;
    });
  },[]);
  const sorted=useMemo(()=>{
    if(!col)return data;
    return[...data].sort((a,b)=>{
      let av=a[col],bv=b[col];
      if(ordMap?.[col]){av=ordMap[col][av]??999;bv=ordMap[col][bv]??999;}
      if(av==null&&bv==null)return 0;
      if(av==null)return 1;if(bv==null)return-1;
      const c=typeof av==="string"?av.localeCompare(bv,"fr"):av-bv;
      return dir==="asc"?c:-c;
    });
  },[data,col,dir]);
  return{sortCol:col,sortDir:dir,handleSort:handle,sortedData:sorted};
}

// ─────────────────────────────────────────────
// 5. COMPOSANTS UI ATOMIQUES
// ─────────────────────────────────────────────
function SortTh({col,label,sortCol,sortDir,onSort,t,style}){
  const a=sortCol===col;
  return(
    <th onClick={()=>onSort(col)} style={{
      padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:600,
      textTransform:"uppercase",letterSpacing:"0.06em",
      color:a?t.accent:t.textSub,cursor:"pointer",userSelect:"none",
      whiteSpace:"nowrap",borderBottom:`1px solid ${t.cardBorder}`,
      transition:"color 0.2s",...style
    }}>
      {label}<span style={{marginLeft:4,opacity:a?1:0.35}}>{a?(sortDir==="asc"?"▲":"▼"):"▼"}</span>
    </th>
  );
}

function Badge({children,color,size="sm"}){
  const s={sm:{padding:"2px 8px",fontSize:10},md:{padding:"4px 12px",fontSize:12}};
  return(
    <span style={{
      display:"inline-block",borderRadius:20,fontWeight:700,
      backgroundColor:color+"20",color,border:`1px solid ${color}40`,...s[size]
    }}>{children}</span>
  );
}

function KpiCard({label,value,sub,color,onClick,icon}){
  const{t}=useTheme();
  const[hov,setHov]=useState(false);
  return(
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background:t.card,
        border:`1px solid ${hov&&onClick?color+"50":t.cardBorder}`,
        borderLeft:`3px solid ${color}`,
        borderRadius:12,padding:"18px 20px",
        cursor:onClick?"pointer":"default",
        transform:hov&&onClick?"translateY(-2px)":"none",
        transition:"all 0.18s cubic-bezier(0.4,0,0.2,1)",
        boxShadow:hov&&onClick
          ?`0 8px 24px ${color}18,0 2px 8px rgba(0,0,0,0.12)`
          :t.shadow,
        position:"relative",overflow:"hidden",
        animation:"fadeIn 0.3s ease",
      }}>
      {/* Halo de fond coloré subtil */}
      <div style={{
        position:"absolute",top:0,right:0,width:80,height:80,
        background:`radial-gradient(circle at top right,${color}10,transparent 70%)`,
        pointerEvents:"none",
      }}/>
      {/* Icône + label */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        {icon&&<span style={{fontSize:16,opacity:0.75}}>{icon}</span>}
        <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",
          letterSpacing:"0.09em",color:t.textMuted}}>{label}</span>
      </div>
      {/* Valeur principale */}
      <div style={{fontSize:28,fontWeight:800,color:t.text,lineHeight:1,
        letterSpacing:"-0.02em",fontVariantNumeric:"tabular-nums"}}>{value}</div>
      {/* Sous-titre */}
      {sub&&<div style={{fontSize:11,color:t.textSub,marginTop:6,fontWeight:500}}>{sub}</div>}
      {/* Flèche cliquable */}
      {onClick&&(
        <div style={{
          position:"absolute",bottom:14,right:16,
          fontSize:11,fontWeight:700,color,opacity:hov?1:0.5,
          transition:"opacity 0.15s",display:"flex",alignItems:"center",gap:3,
        }}>
          Voir <span style={{fontSize:13}}>→</span>
        </div>
      )}
    </div>
  );
}

function Card({title,children,headerRight,style,noPad=false}){
  const{t}=useTheme();
  return(
    <div style={{
      background:t.card,border:`1px solid ${t.cardBorder}`,
      borderRadius:12,overflow:"hidden",boxShadow:t.shadow,...style
    }}>
      {title&&(
        <div style={{
          padding:"14px 20px",borderBottom:`1px solid ${t.cardBorder}`,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          background:t.bg+"40",
        }}>
          <span style={{fontSize:13,fontWeight:700,color:t.text,letterSpacing:"-0.01em"}}>{title}</span>
          {headerRight}
        </div>
      )}
      {noPad?children:<div>{children}</div>}
    </div>
  );
}

function Input({value,onChange,placeholder,type="text",style={}}){
  const{t}=useTheme();
  return(
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type}
      style={{
        background:t.inputBg,border:`1px solid ${t.inputBorder}`,borderRadius:10,
        padding:"8px 12px",color:t.text,fontSize:13,outline:"none",
        width:"100%",...style
      }}/>
  );
}

function SearchInput({value,onChange,placeholder}){
  const{t}=useTheme();
  return(
    <div style={{position:"relative"}}>
      <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",
        color:t.textMuted,fontSize:14}}>🔍</span>
      <Input value={value} onChange={onChange} placeholder={placeholder||"Rechercher…"}
        style={{paddingLeft:34,width:220}}/>
    </div>
  );
}

function FilterPills({options,active,onToggle,colorMap}){
  const{t}=useTheme();
  return(
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      {options.map(opt=>{
        const isA=active.includes(opt);
        const c=colorMap?.[opt]||t.accent;
        return(
          <button key={opt} onClick={()=>onToggle(opt)} style={{
            padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:600,
            cursor:"pointer",border:`1px solid ${isA?c:t.cardBorder}`,
            background:isA?c+"22":"transparent",
            color:isA?c:t.textSub,transition:"all 0.15s"
          }}>{opt}</button>
        );
      })}
    </div>
  );
}

function Btn({children,color,onClick,disabled,variant="outline",size="md"}){
  const{t}=useTheme();
  const[s,setS]=useState("idle");
  const handle=async e=>{
    e.stopPropagation();
    if(s!=="idle"||disabled)return;
    setS("loading");
    await new Promise(r=>setTimeout(r,300));
    onClick&&onClick();
    setS("done");
    await new Promise(r=>setTimeout(r,1000));
    setS("idle");
  };
  const bg=s==="done"?t.accent:color||t.accent;
  const lbl=s==="loading"?"···":s==="done"?"✓":children;
  const pad=size==="sm"?"3px 10px":size==="lg"?"10px 24px":"6px 14px";
  const fz=size==="sm"?11:size==="lg"?14:12;
  return(
    <button onClick={handle} disabled={s!=="idle"||disabled} style={{
      padding:pad,borderRadius:10,fontSize:fz,fontWeight:600,cursor:"pointer",
      border:`1px solid ${bg}`,
      background:variant==="fill"?bg:bg+"22",
      color:variant==="fill"?"#fff":bg,
      transition:"all 0.2s",opacity:(s!=="idle"||disabled)?0.7:1
    }}>{lbl}</button>
  );
}

function ExportBtn({getData,filename}){
  const{t}=useTheme();
  return(
    <button onClick={()=>{
      const rows=getData();if(!rows.length)return;
      const h=Object.keys(rows[0]);
      const csv=["\uFEFF"+h.join(";"),...rows.map(r=>h.map(k=>{
        const v=r[k]==null?"":String(r[k]);
        return v.includes(";")?`"${v}"`:v;
      }).join(";"))].join("\n");
      const a=document.createElement("a");
      a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));
      a.download=filename;a.click();
    }} style={{
      padding:"5px 12px",borderRadius:8,fontSize:11,fontWeight:600,
      border:`1px solid ${t.accent}`,background:t.accent+"15",color:t.accent,
      cursor:"pointer",display:"flex",alignItems:"center",gap:4
    }}>↓ CSV</button>
  );
}

function ToastContainer({toasts}){
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:9999,
      display:"flex",flexDirection:"column",gap:8}}>
      {toasts.map(toast=>(
        <div key={toast.id} style={{
          padding:"12px 18px",borderRadius:12,fontSize:13,fontWeight:500,
          background:toast.type==="success"?"#10B981":toast.type==="warn"?"#F59E0B":"#EF4444",
          color:"#fff",boxShadow:"0 4px 20px rgba(0,0,0,0.3)",
          display:"flex",alignItems:"center",gap:8
        }}>
          <span>{toast.type==="success"?"✓":toast.type==="warn"?"⚠":"✕"}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function SlideOver({open,onClose,children}){
  const{t}=useTheme();
  return(
    <>
      {open&&<div onClick={onClose} style={{position:"fixed",inset:0,
        background:"rgba(0,0,0,0.5)",zIndex:7000}}/>}
      <div style={{
        position:"fixed",top:0,right:0,bottom:0,width:460,
        background:t.surface,borderLeft:`1px solid ${t.cardBorder}`,
        zIndex:7001,transform:open?"translateX(0)":"translateX(100%)",
        transition:"transform 0.25s ease",overflowY:"auto",padding:28,
        boxShadow:open?"-8px 0 40px rgba(0,0,0,0.3)":"none"
      }}>
        <button onClick={onClose} style={{float:"right",background:"none",
          border:"none",color:"#7A8FAF",cursor:"pointer",fontSize:20,lineHeight:1}}>✕</button>
        {children}
      </div>
    </>
  );
}

function ProgressBar({value,max=100,color,height=8,label}){
  const{t}=useTheme();
  const pct=Math.min(100,Math.max(0,(value/max)*100));
  return(
    <div>
      {label&&<div style={{display:"flex",justifyContent:"space-between",
        fontSize:11,color:t.textSub,marginBottom:4}}>
        <span>{label}</span><span style={{fontWeight:700,color}}>{value.toFixed?value.toFixed(1):value}%</span>
      </div>}
      <div style={{height,borderRadius:4,background:t.cardBorder,overflow:"hidden"}}>
        <div style={{height:"100%",width:pct+"%",background:color,
          borderRadius:4,transition:"width 0.6s ease"}}/>
      </div>
    </div>
  );
}

function Gauge({value,max=100,color,size=120,label}){
  const{t}=useTheme();
  const r=42,cx=60,cy=60;
  const circ=2*Math.PI*r;
  const pct=Math.min(1,Math.max(0,value/max));
  const dash=circ*pct;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={t.cardBorder} strokeWidth={10}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ-dash}`}
          strokeDashoffset={circ*0.25}
          strokeLinecap="round"
          style={{transition:"stroke-dasharray 0.8s ease"}}/>
        <text x={cx} y={cy-4} textAnchor="middle" fontSize={16} fontWeight={800} fill={t.text}>
          {value.toFixed?value.toFixed(1):value}%
        </text>
        <text x={cx} y={cy+14} textAnchor="middle" fontSize={9} fill={t.textMuted}>
          / {max}%
        </text>
      </svg>
      {label&&<div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",
        letterSpacing:"0.06em",color:t.textSub}}>{label}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// 6. PAGE DASHBOARD
// ─────────────────────────────────────────────
function PageDashboard(){
  const{t}=useTheme();
  const{pos,setActivePage,tasks}=useData();
  const[dashTab,setDashTab]=useState("overview");

  const ruptures=ITEMS_FULL.filter(i=>i.statut_service==="Rupture");
  const sousSeuil=ITEMS_FULL.filter(i=>i.statut_service==="Sous seuil");
  const conformes=ITEMS_FULL.filter(i=>i.statut_service==="Conforme");
  const tauxSvc=Math.round(conformes.length/ITEMS_FULL.length*1000)/10;
  const poAttente=pos.filter(p=>p.statut==="BROUILLON"||p.statut==="A_VALIDER").length;

  const abcData=useMemo(()=>{
    const cnt={A:0,B:0,C:0},val={A:0,B:0,C:0};
    const tot=ITEMS_FULL.reduce((s,i)=>s+i.val_annuelle,0);
    ITEMS_FULL.forEach(i=>{cnt[i.abc]++;val[i.abc]+=i.val_annuelle;});
    let cum=0;
    return["A","B","C"].map(k=>{
      cum+=val[k];
      return{name:k,count:cnt[k],value:Math.round(val[k]/1000),pct:Math.round(cum/tot*100)};
    });
  },[]);

  const famData=useMemo(()=>{
    const m={};
    ITEMS_FULL.forEach(i=>{m[i.famille]=(m[i.famille]||0)+i.val_annuelle;});
    return Object.entries(m).map(([name,val])=>({name,val:Math.round(val/1000)}))
      .sort((a,b)=>b.val-a.val).slice(0,6);
  },[]);

  const statutPie=[
    {name:"Conforme",value:conformes.length,color:"#10B981"},
    {name:"Sous seuil",value:sousSeuil.length,color:"#F59E0B"},
    {name:"Rupture",value:ruptures.length,color:"#EF4444"},
  ];

  const trsLast=TRS_DATA[TRS_DATA.length-1];
  const trsActuel=+(trsLast.disponibilite/100*trsLast.performance/100*trsLast.qualite/100*100).toFixed(1);

  // ── Données calendrier ────────────────────────────────────────────────
  const TODAY = new Date("2026-03-16");
  const YEAR = 2026, MONTH = 2; // Mars = index 2

  // Articles qui atteindront le seuil dans 30j basé sur consommation journalière
  const alertesSeuil = useMemo(() => {
    return ITEMS_FULL
      .filter(i => i.statut_service === "Conforme" && i.demande > 0)
      .map(i => {
        const consJ = i.demande / 365;
        const joursRestants = Math.floor((i.stock_net - i.seuil_min) / consJ);
        if (joursRestants > 0 && joursRestants <= 30) {
          const d = new Date(TODAY);
          d.setDate(d.getDate() + joursRestants);
          return { ...i, joursRestants, dateSeuil: d, type: "seuil" };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.joursRestants - b.joursRestants);
  }, []);

  // Articles dont le stock est sous le ROP (point de commande)
  const alertesROP = useMemo(() => {
    return ITEMS_FULL
      .filter(i => i.stock_net <= i.rop && i.statut_service !== "Rupture")
      .map(i => {
        const consJ = i.demande / 365;
        const joursRestants = Math.max(0, Math.floor(i.stock_net / consJ));
        const d = new Date(TODAY);
        d.setDate(d.getDate() + Math.min(joursRestants, 30));
        return { ...i, joursRestants, dateSeuil: d, type: "rop" };
      })
      .sort((a, b) => a.joursRestants - b.joursRestants)
      .slice(0, 15);
  }, []);

  // Tâches avec échéance dans les 30 prochains jours
  const alertesTaches = useMemo(() => {
    return (tasks || [])
      .filter(tk => {
        if (tk.status === "Terminée") return false;
        const d = new Date(tk.echeance);
        const diff = Math.floor((d - TODAY) / 86400000);
        return diff >= -1 && diff <= 30;
      })
      .map(tk => {
        const d = new Date(tk.echeance);
        const diff = Math.floor((d - TODAY) / 86400000);
        return { ...tk, dateSeuil: d, joursRestants: diff, type: "tache" };
      })
      .sort((a, b) => a.joursRestants - b.joursRestants);
  }, [tasks]);

  // Tous les événements du calendrier fusionnés
  const allCalEvents = useMemo(() => {
    return [
      ...alertesSeuil.map(i => ({
        id: "s-" + i.id, date: i.dateSeuil, type: "seuil",
        color: "#EF4444", icon: "⚠️",
        titre: "Seuil critique imminent",
        desc: i.sku + " — " + i.article,
        detail: "Dans " + i.joursRestants + "j · Stock: " + i.stock_net + " → Seuil: " + i.seuil_min,
        page: "surveillance",
      })),
      ...alertesROP.map(i => ({
        id: "r-" + i.id, date: i.dateSeuil, type: "rop",
        color: "#F97316", icon: "🛒",
        titre: "PO à créer — ROP atteint",
        desc: i.sku + " — " + i.article,
        detail: "Stock: " + i.stock_net + " ≤ ROP: " + i.rop + " · EOQ: " + i.eoq,
        page: "orders",
      })),
      ...alertesTaches.map(tk => ({
        id: "t-" + tk.id, date: tk.dateSeuil, type: "tache",
        color: "#3B82F6", icon: "✅",
        titre: tk.titre,
        desc: tk.type + " · " + tk.assignee,
        detail: tk.joursRestants < 0 ? "En retard de " + Math.abs(tk.joursRestants) + "j"
              : tk.joursRestants === 0 ? "Échéance aujourd'hui"
              : "Dans " + tk.joursRestants + "j",
        page: "audit",
      })),
    ].sort((a, b) => a.date - b.date);
  }, [alertesSeuil, alertesROP, alertesTaches]);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>

      {/* ── Onglets dashboard ── */}
      <div style={{display:"flex",gap:2,background:t.card,border:`1px solid ${t.cardBorder}`,
        borderRadius:12,padding:4,width:"fit-content"}}>
        {[{k:"overview",l:"📊 Vue globale"},{k:"calendrier",l:"📅 Calendrier"}].map(b=>(
          <button key={b.k} onClick={()=>setDashTab(b.k)} style={{
            padding:"8px 18px",borderRadius:10,fontSize:12,fontWeight:600,
            cursor:"pointer",border:"none",transition:"all 0.2s",
            background:dashTab===b.k?t.accent:"transparent",
            color:dashTab===b.k?"#000":t.textSub,
          }}>{b.l}</button>
        ))}
      </div>

      {dashTab==="overview" && <>
      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:14}}>
        <KpiCard icon="📦" label="Articles SKU" value={ITEMS_FULL.length} sub="base locale (extrait)" color={t.accent} onClick={()=>setActivePage("inventory")}/>
        <KpiCard icon="✅" label="Taux de service" value={tauxSvc+"%"} sub={conformes.length+" conformes"} color={t.accent} onClick={()=>setActivePage("critiques")}/>
        <KpiCard icon="🔴" label="Ruptures" value={ruptures.length} sub="stock net ≤ 0" color={t.danger} onClick={()=>setActivePage("critiques")}/>
        <KpiCard icon="⚠️" label="Sous seuil" value={sousSeuil.length} sub="stock < seuil min" color={t.warning} onClick={()=>setActivePage("critiques")}/>
        <KpiCard icon="📋" label="PO à valider" value={poAttente} sub="BROUILLON+A_VALIDER" color={t.warning} onClick={()=>setActivePage("orders")}/>
        <KpiCard icon="⚡" label="TRS (Déc)" value={trsActuel+"%"} sub={`Cible 80% · ${trsActuel>=80?"✅ Atteint":"⚠ En dessous"}`} color={trsActuel>=80?t.accent:t.danger} onClick={()=>setActivePage("kpi")}/>
      </div>

      {/* Charts row 1 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card title="Répartition ABC (Pareto)">
          <div style={{padding:"16px 16px 8px"}}>
            <ResponsiveContainer width="100%" height={270}>
              <ComposedChart data={abcData} margin={{top:8,right:28,left:0,bottom:8}}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.cardBorder}/>
                <XAxis dataKey="name" tick={{fill:t.text,fontSize:14,fontWeight:700}} axisLine={{stroke:t.cardBorder}} tickLine={false}/>
                <YAxis yAxisId="l" tick={{fill:t.text,fontSize:12}} axisLine={false} tickLine={false} width={36}/>
                <YAxis yAxisId="r" orientation="right" domain={[0,100]} tick={{fill:t.warning,fontSize:12,fontWeight:600}} axisLine={false} tickLine={false} unit="%" width={38}/>
                <Tooltip contentStyle={{background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:10,color:t.text,fontSize:13}}/>
                <Bar yAxisId="l" dataKey="count" name="Articles" radius={[6,6,0,0]}>
                  {abcData.map((e,i)=><Cell key={i} fill={ABC_COLORS[e.name]}/>)}
                </Bar>
                <Line yAxisId="r" type="monotone" dataKey="pct" stroke={t.warning} strokeWidth={2.5} dot={{r:5,fill:t.warning,stroke:"#fff",strokeWidth:2}} name="Cumulé %"/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Statut des articles">
          <div style={{padding:"16px 20px 20px",display:"flex",flexDirection:"column",gap:14}}>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart margin={{top:0,right:0,bottom:0,left:0}}>
                <Pie data={statutPie} cx="50%" cy="50%" innerRadius={58} outerRadius={84} dataKey="value" paddingAngle={3}>
                  {statutPie.map((e,i)=><Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip contentStyle={{background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:10,color:t.text,fontSize:13}}
                  formatter={(val,name)=>[`${val} articles`,name]}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {statutPie.map(s=>{
                const pct=Math.round(s.value/ITEMS_FULL.length*100);
                return(
                  <div key={s.name} style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:12,height:12,borderRadius:3,background:s.color,flexShrink:0}}/>
                    <span style={{fontSize:13,color:t.text,fontWeight:600,flex:1}}>{s.name}</span>
                    <span style={{fontSize:14,fontWeight:800,color:s.color,minWidth:28,textAlign:"right"}}>{s.value}</span>
                    <span style={{fontSize:12,color:t.textSub,minWidth:36,textAlign:"right"}}>{pct}%</span>
                    <div style={{width:56,height:6,borderRadius:3,background:t.cardBorder,overflow:"hidden"}}>
                      <div style={{height:"100%",width:pct+"%",background:s.color,borderRadius:3}}/>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{padding:"8px 12px",background:t.bg,borderRadius:8,border:`1px solid ${t.cardBorder}`}}>
              <div style={{fontSize:10,color:t.textMuted,marginBottom:2}}>Net = Physique + Transit − Réservé</div>
              <div style={{fontSize:11,fontWeight:700,color:t.accent}}>Formule BNMP ✓</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Famille + TRS */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}>
        <Card title="Valeur annuelle par famille (k$ CA)">
          <div style={{padding:"16px 16px 8px"}}>
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={famData} layout="vertical" margin={{top:4,right:16,left:4,bottom:4}}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.cardBorder} horizontal={false}/>
                <XAxis type="number" tick={{fill:t.text,fontSize:12}} axisLine={false} tickLine={false}/>
                <YAxis dataKey="name" type="category" tick={{fill:t.text,fontSize:12,fontWeight:500}} width={105} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:10,color:t.text,fontSize:13}} formatter={v=>[v.toLocaleString()+" k$ CA","Valeur"]}/>
                <Bar dataKey="val" radius={[0,6,6,0]}>
                  {famData.map((_,i)=><Cell key={i} fill={[t.accent,t.info,t.purple,t.warning,"#06B6D4","#EC4899"][i%6]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="TRS Décembre">
          <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
            <Gauge value={trsActuel} max={100} color={trsActuel>=80?t.accent:t.danger} label="TRS Global"/>
            <ProgressBar value={trsLast.disponibilite} max={100} color={t.info} label="Disponibilité"/>
            <ProgressBar value={trsLast.performance} max={100} color={t.purple} label="Performance"/>
            <ProgressBar value={trsLast.qualite} max={100} color={t.accent} label="Qualité"/>
          </div>
        </Card>
      </div>

      {/* Alertes */}
      {ruptures.length>0&&(
        <Card title={`⛔ ${ruptures.length} Rupture(s) de stock — Action immédiate`}>
          <div style={{padding:12,display:"flex",flexDirection:"column",gap:6}}>
            {ruptures.map(i=>(
              <div key={i.id} style={{padding:"10px 16px",background:t.danger+"12",
                border:`1px solid ${t.danger}40`,borderRadius:10,
                display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:16}}>🚨</span>
                <div style={{flex:1}}>
                  <span style={{fontWeight:700,color:t.text,fontSize:13}}>{i.sku} — {i.article}</span>
                  <span style={{color:t.textSub,fontSize:12,marginLeft:8}}>Stock: <strong style={{color:t.danger}}>{i.stock_net}</strong> · Seuil: {i.seuil_min} · EOQ: {i.eoq}</span>
                </div>
                <Badge color={t.danger}>RUPTURE</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
      </>}

      {/* ════════════════════════════════════ */}
      {/* ONGLET CALENDRIER                   */}
      {/* ════════════════════════════════════ */}
      {dashTab==="calendrier" && <CalendrierReappro
        allCalEvents={allCalEvents}
        alertesSeuil={alertesSeuil}
        alertesROP={alertesROP}
        alertesTaches={alertesTaches}
        setActivePage={setActivePage}
        t={t}
      />}

    </div>
  );
}

// ─────────────────────────────────────────────
// 6b. COMPOSANT CALENDRIER RÉAPPROVISIONNEMENT
// ─────────────────────────────────────────────
function CalendrierReappro({allCalEvents,alertesSeuil,alertesROP,alertesTaches,setActivePage,t}){
  const[calView,setCalView]=useState("mensuelle");
  const[calMonth,setCalMonth]=useState(new Date("2026-03-01"));

  const YEAR=calMonth.getFullYear();
  const MONTH=calMonth.getMonth();
  const firstDay=new Date(YEAR,MONTH,1).getDay(); // 0=dim
  const daysInMonth=new Date(YEAR,MONTH+1,0).getDate();
  const MONTH_NAMES=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const DAY_NAMES=["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
  const TODAY_STR="2026-03-16";

  // Événements groupés par jour du mois courant
  const eventsByDay=useMemo(()=>{
    const map={};
    allCalEvents.forEach(ev=>{
      if(ev.date.getFullYear()===YEAR && ev.date.getMonth()===MONTH){
        const d=ev.date.getDate();
        if(!map[d])map[d]=[];
        map[d].push(ev);
      }
    });
    return map;
  },[allCalEvents,YEAR,MONTH]);

  // Événements des 30 prochains jours pour vue liste
  const listEvents=useMemo(()=>allCalEvents.filter(ev=>{
    const diff=Math.floor((ev.date-new Date("2026-03-16"))/86400000);
    return diff>=-1&&diff<=30;
  }),[allCalEvents]);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>

      {/* KPI résumé */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14}}>
        {[
          {icon:"⚠️",label:"Seuils critiques",value:alertesSeuil.length,sub:"dans 30 jours",color:"#EF4444"},
          {icon:"🛒",label:"PO à créer",value:alertesROP.length,sub:"ROP atteint",color:"#F97316"},
          {icon:"✅",label:"Tâches à venir",value:alertesTaches.length,sub:"avec échéance",color:"#3B82F6"},
          {icon:"📅",label:"Événements total",value:allCalEvents.length,sub:"sur 30 jours",color:"#8B5CF6"},
        ].map(k=>(
          <KpiCard key={k.label} icon={k.icon} label={k.label} value={k.value} sub={k.sub} color={k.color}/>
        ))}
      </div>

      {/* Barre de navigation */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
        <div style={{display:"flex",gap:2,background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:10,padding:3}}>
          {[{k:"mensuelle",l:"📆 Mensuelle"},{k:"liste",l:"📋 Liste 30j"}].map(b=>(
            <button key={b.k} onClick={()=>setCalView(b.k)} style={{
              padding:"6px 14px",borderRadius:8,fontSize:11,fontWeight:600,
              cursor:"pointer",border:"none",transition:"all 0.2s",
              background:calView===b.k?t.accent:"transparent",
              color:calView===b.k?"#000":t.textSub,
            }}>{b.l}</button>
          ))}
        </div>
        {calView==="mensuelle"&&(
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setCalMonth(m=>new Date(m.getFullYear(),m.getMonth()-1,1))}
              style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${t.cardBorder}`,
                background:t.card,color:t.textSub,cursor:"pointer",fontSize:14}}>‹</button>
            <span style={{fontSize:14,fontWeight:700,color:t.text,minWidth:130,textAlign:"center"}}>
              {MONTH_NAMES[MONTH]} {YEAR}
            </span>
            <button onClick={()=>setCalMonth(m=>new Date(m.getFullYear(),m.getMonth()+1,1))}
              style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${t.cardBorder}`,
                background:t.card,color:t.textSub,cursor:"pointer",fontSize:14}}>›</button>
          </div>
        )}
        {/* Légende */}
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          {[["⚠️","Seuil critique","#EF4444"],["🛒","PO à créer","#F97316"],["✅","Tâche","#3B82F6"]].map(([ic,lb,cl])=>(
            <div key={lb} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:cl,flexShrink:0}}/>
              <span style={{fontSize:11,color:t.textSub}}>{lb}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── VUE MENSUELLE ── */}
      {calView==="mensuelle"&&(
        <div style={{background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:16,overflow:"hidden",boxShadow:t.shadow}}>
          {/* Jours de la semaine */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`1px solid ${t.cardBorder}`}}>
            {DAY_NAMES.map(d=>(
              <div key={d} style={{padding:"10px 0",textAlign:"center",fontSize:11,fontWeight:700,
                textTransform:"uppercase",letterSpacing:"0.06em",color:t.textMuted}}>
                {d}
              </div>
            ))}
          </div>
          {/* Grille des jours */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {/* Cases vides avant le 1er */}
            {Array.from({length:(firstDay+6)%7}).map((_,i)=>(
              <div key={"e"+i} style={{minHeight:90,borderRight:`1px solid ${t.cardBorder}15`,
                borderBottom:`1px solid ${t.cardBorder}15`,background:t.bg+"50"}}/>
            ))}
            {/* Jours du mois */}
            {Array.from({length:daysInMonth},(_,i)=>i+1).map(day=>{
              const evs=eventsByDay[day]||[];
              const dateStr=`${YEAR}-${String(MONTH+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const isToday=dateStr===TODAY_STR;
              const isPast=dateStr<TODAY_STR;
              return(
                <div key={day} style={{
                  minHeight:90,padding:"6px 8px",
                  borderRight:`1px solid ${t.cardBorder}15`,
                  borderBottom:`1px solid ${t.cardBorder}15`,
                  background:isToday?t.accent+"10":isPast?t.bg+"30":"transparent",
                  transition:"background 0.1s",
                }}
                onMouseEnter={e=>!isToday&&(e.currentTarget.style.background=t.bg)}
                onMouseLeave={e=>!isToday&&(e.currentTarget.style.background=isPast?t.bg+"30":"transparent")}>
                  {/* Numéro du jour */}
                  <div style={{
                    width:24,height:24,borderRadius:"50%",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:12,fontWeight:isToday?800:400,
                    background:isToday?t.accent:"transparent",
                    color:isToday?"#000":isPast?t.textMuted:t.text,
                    marginBottom:4,
                  }}>{day}</div>
                  {/* Événements du jour */}
                  <div style={{display:"flex",flexDirection:"column",gap:2}}>
                    {evs.slice(0,3).map((ev,ei)=>(
                      <div key={ev.id}
                        onClick={()=>setActivePage(ev.page)}
                        style={{
                          padding:"2px 5px",borderRadius:4,fontSize:9,fontWeight:700,
                          background:ev.color+"20",color:ev.color,
                          border:`1px solid ${ev.color}30`,cursor:"pointer",
                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                          maxWidth:"100%",
                        }}>
                        {ev.icon} {ev.desc.split(" — ")[0]}
                      </div>
                    ))}
                    {evs.length>3&&(
                      <div style={{fontSize:9,color:t.textMuted,paddingLeft:2}}>
                        +{evs.length-3} autre{evs.length-3>1?"s":""}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── VUE LISTE 30 JOURS ── */}
      {calView==="liste"&&(
        <div style={{background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:16,overflow:"hidden",boxShadow:t.shadow}}>
          {listEvents.length===0?(
            <div style={{padding:40,textAlign:"center",color:t.textMuted,fontSize:13}}>
              ✅ Aucun événement dans les 30 prochains jours
            </div>
          ):(
            <div>
              {/* Regroupement par date */}
              {(() => {
                const grouped={};
                listEvents.forEach(ev=>{
                  const key=ev.date.toISOString().split("T")[0];
                  if(!grouped[key])grouped[key]=[];
                  grouped[key].push(ev);
                });
                return Object.entries(grouped).map(([dateKey,evs])=>{
                  const d=new Date(dateKey);
                  const diff=Math.floor((d-new Date("2026-03-16"))/86400000);
                  const label=diff<0?"En retard":diff===0?"Aujourd'hui":diff===1?"Demain":"Dans "+diff+"j";
                  const labelColor=diff<0?"#EF4444":diff===0?"#10B981":diff<=3?"#F59E0B":t.textSub;
                  return(
                    <div key={dateKey}>
                      {/* En-tête de groupe date */}
                      <div style={{padding:"10px 20px",background:t.bg,
                        borderBottom:`1px solid ${t.cardBorder}`,
                        display:"flex",alignItems:"center",gap:12}}>
                        <div style={{fontSize:13,fontWeight:800,color:t.text}}>
                          {d.toLocaleDateString("fr-CA",{weekday:"long",day:"numeric",month:"long"})}
                        </div>
                        <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:10,
                          background:labelColor+"20",color:labelColor}}>
                          {label}
                        </span>
                        <span style={{fontSize:11,color:t.textMuted,marginLeft:"auto"}}>
                          {evs.length} événement{evs.length>1?"s":""}
                        </span>
                      </div>
                      {/* Événements de la journée */}
                      {evs.map(ev=>(
                        <div key={ev.id}
                          onClick={()=>setActivePage(ev.page)}
                          style={{
                            display:"flex",alignItems:"center",gap:14,
                            padding:"13px 20px",cursor:"pointer",
                            borderBottom:`1px solid ${t.cardBorder}10`,
                            transition:"background 0.1s",
                          }}
                          onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          {/* Icône type */}
                          <div style={{
                            width:36,height:36,borderRadius:10,flexShrink:0,
                            background:ev.color+"18",border:`1.5px solid ${ev.color}40`,
                            display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,
                          }}>{ev.icon}</div>
                          {/* Contenu */}
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:12,fontWeight:700,color:t.text,marginBottom:2}}>{ev.titre}</div>
                            <div style={{fontSize:12,color:t.textSub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.desc}</div>
                            <div style={{fontSize:11,color:t.textMuted,marginTop:2}}>{ev.detail}</div>
                          </div>
                          {/* Badge type */}
                          <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:10,
                            background:ev.color+"20",color:ev.color,flexShrink:0,whiteSpace:"nowrap"}}>
                            {{seuil:"Seuil critique",rop:"PO à créer",tache:"Tâche"}[ev.type]}
                          </span>
                          <span style={{fontSize:14,color:ev.color,flexShrink:0}}>→</span>
                        </div>
                      ))}
                    </div>
                  );
                });
              })()}
            </div>
          )}
          {/* Pied */}
          <div style={{padding:"10px 20px",borderTop:`1px solid ${t.cardBorder}`,
            display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:11,color:t.textMuted}}>
              {listEvents.length} événement{listEvents.length>1?"s":""}  sur les 30 prochains jours
            </span>
            <span style={{fontSize:11,color:t.textSub}}>
              Cliquez sur un événement pour accéder à la section concernée
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 7. PAGE INVENTAIRE
// ─────────────────────────────────────────────
function PageInventory(){
  const{t}=useTheme();
  const{setSlideOver}=useData();
  const[search,setSearch]=useState("");
  const[abc,setAbc]=useState([]);
  const[fam,setFam]=useState([]);
  const[page,setPage]=useState(1);
  const PER=15;

  // CRUD state
  const[items,setItems]=useState(ITEMS_FULL);
  const[showAddForm,setShowAddForm]=useState(false);
  const[form,setForm]=useState({sku:"",article:"",famille:"Electrique",stock_physique:0,stock_transit:0,stock_reserve:0,seuil_min:0,demande:100,cout_unit:50,lead_time:7,taux_poss:0.2,cout_cmd:50});

  const toggle=(arr,setArr,v)=>setArr(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);

  // Calculs BNMP
  const calcEOQ=(d,S,h,c)=>Math.round(Math.sqrt((2*d*S)/(h*c)));
  const calcROP=(d,lt,ss)=>Math.round((d/365)*lt+ss);
  const calcNet=(ph,tr,re)=>ph+(tr||0)-(re||0);
  const calcCouverture=(net,d)=>d>0?+((net/(d/365))).toFixed(1):0;
  const calcStatut=(net,seuil)=>net<=0?"Rupture":net<seuil?"Sous seuil":"Conforme";

  const filtered=useMemo(()=>{
    let d=items;
    if(search){const s=search.toLowerCase();d=d.filter(i=>i.sku.toLowerCase().includes(s)||i.article.toLowerCase().includes(s));}
    if(abc.length)d=d.filter(i=>abc.includes(i.abc));
    if(fam.length)d=d.filter(i=>fam.includes(i.famille));
    return d;
  },[items,search,abc,fam]);

  const{sortCol,sortDir,handleSort,sortedData}=useSortable(filtered,ORDINAL_MAPS);
  const paginated=useMemo(()=>sortedData.slice((page-1)*PER,page*PER),[sortedData,page]);
  const totalPages=Math.ceil(sortedData.length/PER);

  const handleAdd=()=>{
    const eoq=calcEOQ(form.demande,form.cout_cmd,form.taux_poss,form.cout_unit);
    const net=calcNet(+form.stock_physique,+form.stock_transit,+form.stock_reserve);
    const couv=calcCouverture(net,form.demande);
    const ss=Math.round((form.demande/365)*form.lead_time*0.3);
    const rop=calcROP(form.demande,form.lead_time,ss);
    const statut=calcStatut(net,+form.seuil_min);
    const abc_cls=form.cout_unit*form.demande>2000000?"A":form.cout_unit*form.demande>500000?"B":"C";
    const newItem={
      id:Date.now(),sku:form.sku||"SKU-NEW",article:form.article,
      famille:form.famille,demande:+form.demande,cout_unit:+form.cout_unit,
      lead_time:+form.lead_time,stock_secu:ss,taux_poss:+form.taux_poss,
      cout_cmd:+form.cout_cmd,val_annuelle:+form.demande*+form.cout_unit,
      eoq,rop,stock_physique:+form.stock_physique,
      stock_transit:+form.stock_transit,stock_reserve:+form.stock_reserve,
      stock_net:net,seuil_min:+form.seuil_min,couverture:couv,
      abc:abc_cls,statut_service:statut,priorite:statut==="Rupture"?"Haute":statut==="Sous seuil"?"Haute":"Moyenne",
      politique:"Contrat-cadre + revue mensuelle",economie:Math.round(eoq*+form.cout_unit*0.02),
      supplier_id:1,xyz:"Y",
      msg_reappro:net<+form.seuil_min?`⚠ RÉAPPROVISIONNEMENT — ${form.article}: Net=${net} < Seuil=${form.seuil_min}. Commander EOQ=${eoq}`:null
    };
    setItems(p=>[newItem,...p]);
    setShowAddForm(false);
    setForm({sku:"",article:"",famille:"Electrique",stock_physique:0,stock_transit:0,stock_reserve:0,seuil_min:0,demande:100,cout_unit:50,lead_time:7,taux_poss:0.2,cout_cmd:50});
  };

  const handleDelete=id=>setItems(p=>p.filter(i=>i.id!==id));

  const cols=[
    {k:"sku",l:"SKU"},{k:"article",l:"Article"},{k:"famille",l:"Famille"},
    {k:"abc",l:"ABC"},{k:"stock_physique",l:"Physique"},{k:"stock_transit",l:"Transit"},
    {k:"stock_reserve",l:"Réservé"},{k:"stock_net",l:"Net dispo"},
    {k:"seuil_min",l:"Seuil"},{k:"eoq",l:"EOQ"},{k:"rop",l:"ROP"},
    {k:"couverture",l:"Couv.(j)"},{k:"statut_service",l:"Statut"},{k:"priorite",l:"Priorité"}
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Filtres */}
      <Card noPad>
        <div style={{padding:16,display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <SearchInput value={search} onChange={v=>{setSearch(v);setPage(1);}} placeholder="SKU ou article…"/>
          <FilterPills options={["A","B","C"]} active={abc} onToggle={v=>{toggle(abc,setAbc,v);setPage(1);}} colorMap={ABC_COLORS}/>
          <FilterPills options={FAMILLES.slice(0,4)} active={fam} onToggle={v=>{toggle(fam,setFam,v);setPage(1);}}/>
          <span style={{marginLeft:"auto",fontSize:12,color:t.textSub}}>{sortedData.length} articles</span>
          <Btn color={t.accent} variant="fill" size="sm" onClick={()=>setShowAddForm(s=>!s)}>+ Ajouter</Btn>
        </div>
      </Card>

      {/* Formulaire CRUD */}
      {showAddForm&&(
        <Card title="Ajouter un article — Calculs BNMP automatiques">
          <div style={{padding:16,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
            {[
              {k:"sku",l:"SKU",ph:"SKU-XXXX"},
              {k:"article",l:"Article",ph:"Nom article"},
              {k:"stock_physique",l:"Stock physique",t:"number"},
              {k:"stock_transit",l:"Stock en transit",t:"number"},
              {k:"stock_reserve",l:"Stock réservé",t:"number"},
              {k:"seuil_min",l:"Seuil minimum",t:"number"},
              {k:"demande",l:"Demande annuelle",t:"number"},
              {k:"cout_unit",l:"Coût unitaire ($CA)",t:"number"},
              {k:"lead_time",l:"Lead time (j)",t:"number"},
              {k:"cout_cmd",l:"Coût commande ($CA)",t:"number"},
            ].map(f=>(
              <div key={f.k}>
                <label style={{fontSize:11,color:t.textSub,display:"block",marginBottom:4}}>{f.l}</label>
                <Input value={form[f.k]} onChange={v=>setForm(p=>({...p,[f.k]:v}))} placeholder={f.ph} type={f.t||"text"}/>
              </div>
            ))}
            <div>
              <label style={{fontSize:11,color:t.textSub,display:"block",marginBottom:4}}>Famille</label>
              <select value={form.famille} onChange={e=>setForm(p=>({...p,famille:e.target.value}))}
                style={{background:t.inputBg,border:`1px solid ${t.inputBorder}`,borderRadius:10,
                  padding:"8px 12px",color:t.text,fontSize:13,width:"100%"}}>
                {FAMILLES.map(f=><option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div style={{padding:"0 16px 16px",display:"flex",gap:10}}>
            <Btn color={t.accent} variant="fill" onClick={handleAdd}>Créer article</Btn>
            <Btn color={t.danger} onClick={()=>setShowAddForm(false)}>Annuler</Btn>
          </div>
        </Card>
      )}

      {/* Alertes réappro */}
      {items.filter(i=>i.msg_reappro).slice(0,3).map(i=>(
        <div key={i.id} style={{padding:"10px 16px",background:t.warning+"12",
          border:`1px solid ${t.warning}40`,borderRadius:12,fontSize:12,
          color:t.text,display:"flex",gap:8,alignItems:"center"}}>
          <span>⚠️</span>{i.msg_reappro}
        </div>
      ))}

      {/* Table */}
      <Card headerRight={
        <ExportBtn getData={()=>sortedData.map(i=>({SKU:i.sku,Article:i.article,Famille:i.famille,ABC:i.abc,
          Physique:i.stock_physique,Transit:i.stock_transit,Réservé:i.stock_reserve,
          "Net dispo":i.stock_net,Seuil:i.seuil_min,EOQ:i.eoq,ROP:i.rop,
          "Couverture(j)":i.couverture,Statut:i.statut_service}))} filename="inventaire.csv"/>
      }>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {cols.map(c=><SortTh key={c.k} col={c.k} label={c.l} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} t={t}/>)}
              <th style={{padding:"10px 14px",borderBottom:`1px solid ${t.cardBorder}`,fontSize:10,color:t.textMuted}}>Action</th>
            </tr></thead>
            <tbody>
              {paginated.map(item=>(
                <tr key={item.id} onClick={()=>setSlideOver({type:"item",data:item})}
                  style={{borderBottom:`1px solid ${t.cardBorder}20`,cursor:"pointer",transition:"background 0.1s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"8px 14px",fontSize:12,color:t.accent,fontWeight:700}}>{item.sku}</td>
                  <td style={{padding:"8px 14px",fontSize:12,color:t.text,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.article}</td>
                  <td style={{padding:"8px 14px",fontSize:11,color:t.textSub}}>{item.famille}</td>
                  <td style={{padding:"8px 14px"}}><Badge color={ABC_COLORS[item.abc]}>{item.abc}</Badge></td>
                  <td style={{padding:"8px 14px",fontSize:12,color:t.text,textAlign:"right"}}>{item.stock_physique}</td>
                  <td style={{padding:"8px 14px",fontSize:12,color:item.stock_transit>0?t.info:t.textMuted,textAlign:"right"}}>{item.stock_transit||0}</td>
                  <td style={{padding:"8px 14px",fontSize:12,color:item.stock_reserve>0?t.warning:t.textMuted,textAlign:"right"}}>{item.stock_reserve||0}</td>
                  <td style={{padding:"8px 14px",fontSize:12,fontWeight:700,
                    color:item.stock_net<=0?t.danger:item.stock_net<item.seuil_min?t.warning:t.accent,
                    textAlign:"right"}}>{item.stock_net}</td>
                  <td style={{padding:"8px 14px",fontSize:12,color:t.textSub,textAlign:"right"}}>{item.seuil_min}</td>
                  <td style={{padding:"8px 14px",fontSize:12,color:t.info,textAlign:"right"}}>{item.eoq}</td>
                  <td style={{padding:"8px 14px",fontSize:12,color:t.textSub,textAlign:"right"}}>{item.rop}</td>
                  <td style={{padding:"8px 14px",fontSize:12,fontWeight:600,textAlign:"right",
                    color:item.couverture<15?t.danger:item.couverture<30?t.warning:t.text}}>{item.couverture}j</td>
                  <td style={{padding:"8px 14px"}}><Badge color={STATUS_COLORS[item.statut_service]}>{item.statut_service}</Badge></td>
                  <td style={{padding:"8px 14px"}}><Badge color={PRIO_COLORS[item.priorite]}>{item.priorite}</Badge></td>
                  <td style={{padding:"8px 14px"}} onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>handleDelete(item.id)} style={{padding:"2px 8px",borderRadius:6,
                      background:t.danger+"15",border:`1px solid ${t.danger}40`,
                      color:t.danger,cursor:"pointer",fontSize:11}}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:10,
          borderTop:`1px solid ${t.cardBorder}`}}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
            style={{padding:"4px 12px",borderRadius:8,border:`1px solid ${t.cardBorder}`,
              background:"transparent",color:t.textSub,cursor:"pointer"}}>‹</button>
          <span style={{fontSize:12,color:t.textSub}}>Page {page} / {totalPages}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
            style={{padding:"4px 12px",borderRadius:8,border:`1px solid ${t.cardBorder}`,
              background:"transparent",color:t.textSub,cursor:"pointer"}}>›</button>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// 8. PAGE PROCESSUS UML (Séance 1-2)
// ─────────────────────────────────────────────
function PageProcessus(){
  const{t}=useTheme();
  const[view,setView]=useState("asIs");

  const ASSIS_STEPS=[
    {lane:"Magasinier",steps:[
      {id:"S1",label:"Détecte manque stock",icon:"👀",type:"start"},
      {id:"S2",label:"Remplit bon commande",icon:"📝",type:"action"},
      {id:"S3",label:"Transmis à acheteur",icon:"📨",type:"send"},
    ]},
    {lane:"Acheteur",steps:[
      {id:"A1",label:"Reçoit bon commande",icon:"📬",type:"receive"},
      {id:"A2",label:"Vérifie + approuve",icon:"✅",type:"decision"},
      {id:"A3",label:"Envoie à fournisseur",icon:"🏭",type:"action"},
    ]},
    {lane:"Système",steps:[
      {id:"SY1",label:"(aucune action auto)",icon:"💤",type:"idle"},
      {id:"SY2",label:"(aucune alerte auto)",icon:"💤",type:"idle"},
    ]},
  ];

  const TOBE_STEPS=[
    {lane:"Magasinier",steps:[
      {id:"T1",label:"Reçoit alerte auto",icon:"🔔",type:"auto"},
      {id:"T2",label:"Valide ou annule",icon:"✅",type:"decision"},
    ]},
    {lane:"Système",steps:[
      {id:"SY1",label:"Calcule Net = Ph+Tr−Rés",icon:"🧮",type:"calc"},
      {id:"SY2",label:"Net < Seuil → Alerte",icon:"⚡",type:"auto"},
      {id:"SY3",label:"Génère PO Brouillon",icon:"📋",type:"auto"},
      {id:"SY4",label:"Journalise événement",icon:"📒",type:"auto"},
    ]},
    {lane:"Acheteur",steps:[
      {id:"A1",label:"Valide PO",icon:"🖊️",type:"decision"},
      {id:"A2",label:"Envoie au fournisseur",icon:"🏭",type:"action"},
      {id:"A3",label:"Réception confirmée",icon:"📦",type:"end"},
    ]},
  ];

  const steps=view==="asIs"?ASSIS_STEPS:TOBE_STEPS;
  const laneColors=[t.info,t.accent,t.purple,t.warning];

  const typeColors={
    start:"#10B981",end:"#10B981",action:t.info,decision:"#F59E0B",
    send:"#8B5CF6",receive:"#8B5CF6",auto:t.accent,calc:t.info,idle:t.textMuted
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* Toggle */}
      <div style={{display:"flex",gap:2,background:t.card,border:`1px solid ${t.cardBorder}`,
        borderRadius:12,padding:4,width:"fit-content"}}>
        {[{k:"asIs",l:"📌 AS-IS (Processus actuel)"},{k:"toBe",l:"🚀 TO-BE (Cible)"}].map(b=>(
          <button key={b.k} onClick={()=>setView(b.k)} style={{
            padding:"8px 20px",borderRadius:10,fontSize:13,fontWeight:600,
            cursor:"pointer",border:"none",transition:"all 0.2s",
            background:view===b.k?t.accent:"transparent",
            color:view===b.k?"#fff":t.textSub
          }}>{b.l}</button>
        ))}
      </div>

      {/* Diagramme swimlanes */}
      <Card title={view==="asIs"?"Processus AS-IS — Réapprovisionnement manuel (problèmes identifiés)":"Processus TO-BE — Réapprovisionnement intelligent (automatisé)"}>
        <div style={{padding:20}}>
          {steps.map((lane,li)=>(
            <div key={lane.lane} style={{display:"flex",marginBottom:16,
              border:`1px solid ${laneColors[li]||t.cardBorder}30`,borderRadius:12,overflow:"hidden"}}>
              {/* Lane header */}
              <div style={{width:120,minWidth:120,background:laneColors[li]+"15",
                borderRight:`2px solid ${laneColors[li]||t.cardBorder}40`,
                display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
                <div style={{writingMode:"vertical-rl",textOrientation:"mixed",
                  transform:"rotate(180deg)",fontSize:12,fontWeight:700,
                  color:laneColors[li]||t.textSub,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                  {lane.lane}
                </div>
              </div>
              {/* Steps */}
              <div style={{flex:1,padding:"16px 20px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                {lane.steps.map((step,si)=>(
                  <div key={step.id} style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{
                      background:typeColors[step.type]+"20",
                      border:`2px solid ${typeColors[step.type]}60`,
                      borderRadius:step.type==="decision"?4:12,
                      padding:"10px 16px",minWidth:130,textAlign:"center",
                      transform:step.type==="decision"?"rotate(0deg)":"none"
                    }}>
                      <div style={{fontSize:18,marginBottom:4}}>{step.icon}</div>
                      <div style={{fontSize:11,fontWeight:600,color:typeColors[step.type]}}>[{step.id}]</div>
                      <div style={{fontSize:12,color:t.text,lineHeight:1.3}}>{step.label}</div>
                    </div>
                    {si<lane.steps.length-1&&(
                      <div style={{fontSize:18,color:t.textMuted}}>→</div>
                    )}
                    {view==="asIs"&&(step.type==="idle")&&(
                      <div style={{position:"relative"}}>
                        <div style={{position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)",
                          background:t.danger+"20",border:`1px solid ${t.danger}40`,borderRadius:8,
                          padding:"2px 8px",fontSize:10,fontWeight:700,color:t.danger,whiteSpace:"nowrap"}}>
                          ❌ Problème
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Légende */}
          <div style={{marginTop:16,padding:"12px 16px",background:t.bg,borderRadius:10,
            border:`1px solid ${t.cardBorder}`,display:"flex",gap:16,flexWrap:"wrap"}}>
            {Object.entries(typeColors).slice(0,6).map(([k,c])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:12,height:12,borderRadius:3,background:c+"40",
                  border:`1.5px solid ${c}80`}}/>
                <span style={{fontSize:11,color:t.textSub,textTransform:"capitalize"}}>{k}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tableau comparatif */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {[
          {title:"❌ Problèmes AS-IS",color:t.danger,items:[
            "Détection manuelle → retards","Aucune alerte automatique",
            "Calcul net non systématique","Traçabilité absente",
            "Risques de doublon de commandes","Délai de réaction > 48h"
          ]},
          {title:"✅ Gains TO-BE",color:t.accent,items:[
            "Alerte auto si Net < Seuil","Calcul Net = Ph + Transit − Réservé",
            "PO généré automatiquement","Journal d'audit complet",
            "Garde-fous anti-doublons","Réaction en temps réel"
          ]}
        ].map(panel=>(
          <Card key={panel.title} title={panel.title}>
            <div style={{padding:16,display:"flex",flexDirection:"column",gap:8}}>
              {panel.items.map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,
                  padding:"8px 12px",background:panel.color+"0A",borderRadius:8,
                  border:`1px solid ${panel.color}20`}}>
                  <span style={{color:panel.color,flexShrink:0}}>•</span>
                  <span style={{fontSize:12,color:t.text}}>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 9. PAGE KPI + TRS (Séance 3-4)
// ─────────────────────────────────────────────
function PageKPI(){
  const{t}=useTheme();

  const trsActuel=TRS_DATA[TRS_DATA.length-1];
  const trsGlobal=+(trsActuel.disponibilite/100*trsActuel.performance/100*trsActuel.qualite/100*100).toFixed(1);
  const trsMoy=+(TRS_DATA.reduce((s,m)=>s+m.trs,0)/TRS_DATA.length).toFixed(1);
  const moisBonus=TRS_DATA.filter(m=>m.trs>=80).length;

  const kpiStock=useMemo(()=>{
    const tot=ITEMS_FULL.length;
    const conf=ITEMS_FULL.filter(i=>i.statut_service==="Conforme").length;
    const rupt=ITEMS_FULL.filter(i=>i.statut_service==="Rupture").length;
    const valTot=ITEMS_FULL.reduce((s,i)=>s+i.val_annuelle,0);
    const couv=+(ITEMS_FULL.reduce((s,i)=>s+(i.couverture||0),0)/tot).toFixed(1);
    return{
      tauxSvc:+(conf/tot*100).toFixed(1),
      txRupture:+(rupt/tot*100).toFixed(1),
      valTot:Math.round(valTot/1000000),
      couvMoy:couv,
      rotationMoy:+(365/couv).toFixed(1),
      ecoTotal:Math.round(ITEMS_FULL.reduce((s,i)=>s+(i.economie||0),0)/1000)
    };
  },[]);

  const radarData=[
    {metric:"Taux service",value:kpiStock.tauxSvc,full:100},
    {metric:"TRS",value:trsGlobal,full:100},
    {metric:"Conformité",value:88,full:100},
    {metric:"Rotation",value:Math.min(100,kpiStock.rotationMoy*5),full:100},
    {metric:"Couverture",value:Math.min(100,kpiStock.couvMoy*2),full:100},
    {metric:"Économies",value:Math.min(100,kpiStock.ecoTotal/20),full:100},
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>
        <KpiCard icon="🎯" label="Taux de service" value={kpiStock.tauxSvc+"%"} sub="articles conformes" color={kpiStock.tauxSvc>=90?t.accent:t.warning}/>
        <KpiCard icon="🔴" label="Taux rupture" value={kpiStock.txRupture+"%"} sub="stock net ≤ 0" color={t.danger}/>
        <KpiCard icon="🍁" label="Valeur annuelle" value={kpiStock.valTot+"M$"} sub="portefeuille total" color={t.info}/>
        <KpiCard icon="📅" label="Couverture moy." value={kpiStock.couvMoy+"j"} sub="jours de stock" color={t.purple}/>
        <KpiCard icon="🔄" label="Rotation stock" value={kpiStock.rotationMoy+"x/an"} sub="365/couverture" color={t.accent}/>
        <KpiCard icon="💰" label="Économies EOQ" value={kpiStock.ecoTotal+"k$"} sub="potentiel identifié" color={t.accent}/>
      </div>

      {/* TRS Section */}
      <Card title="📊 Analyse TRS — Taux de Rendement Synthétique">
        <div style={{padding:16}}>
          <div style={{marginBottom:16,padding:"12px 16px",background:t.bg,borderRadius:10,
            border:`1px solid ${t.cardBorder}`,fontSize:12,color:t.textSub}}>
            <strong style={{color:t.text}}>Formule TRS = </strong>
            <span style={{color:t.accent,fontFamily:"monospace"}}>
              Disponibilité(%) × Performance(%) × Qualité(%)
            </span>
            <span style={{marginLeft:8}}>→ Actuel: {trsActuel.disponibilite}% × {trsActuel.performance}% × {trsActuel.qualite}% = </span>
            <strong style={{color:trsGlobal>=80?t.accent:t.danger}}>{trsGlobal}%</strong>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:20,alignItems:"center"}}>
            <div style={{display:"flex",gap:20}}>
              <Gauge value={trsGlobal} max={100} color={trsGlobal>=80?t.accent:t.danger} label="TRS Global"/>
              <Gauge value={trsActuel.disponibilite} max={100} color={t.info} label="Disponib."/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <ProgressBar value={trsActuel.disponibilite} max={100} color={t.info} label="Disponibilité"/>
              <ProgressBar value={trsActuel.performance} max={100} color={t.purple} label="Performance"/>
              <ProgressBar value={trsActuel.qualite} max={100} color={t.accent} label="Qualité"/>
              <div style={{display:"flex",gap:16,marginTop:8}}>
                <div style={{fontSize:12,color:t.textSub}}>Moy. annuelle: <strong style={{color:t.text}}>{trsMoy}%</strong></div>
                <div style={{fontSize:12,color:t.textSub}}>Mois ≥ 80%: <strong style={{color:t.accent}}>{moisBonus}/12</strong></div>
              </div>
            </div>
          </div>

          {/* Graphique TRS 12 mois */}
          <div style={{marginTop:20}}>
            <ResponsiveContainer width="100%" height={270}>
              <ComposedChart data={TRS_DATA} margin={{top:8,right:16,left:0,bottom:8}}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.cardBorder}/>
                <XAxis dataKey="mois" tick={{fill:t.text,fontSize:12,fontWeight:500}} axisLine={{stroke:t.cardBorder}} tickLine={false}/>
                <YAxis domain={[60,100]} tick={{fill:t.text,fontSize:12}} unit="%" axisLine={false} tickLine={false} width={42}/>
                <Tooltip contentStyle={{background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:10,color:t.text,fontSize:13}}/>
                <Legend formatter={v=><span style={{color:t.text,fontSize:12,fontWeight:600}}>{v}</span>}/>
                <Area type="monotone" dataKey="disponibilite" fill={t.info+"20"} stroke={t.info} name="Disponibilité" strokeWidth={1.5}/>
                <Area type="monotone" dataKey="performance" fill={t.purple+"20"} stroke={t.purple} name="Performance" strokeWidth={1.5}/>
                <Line type="monotone" dataKey="trs" stroke={t.accent} strokeWidth={3} dot={{r:4,fill:t.accent}} name="TRS"/>
                <Line type="monotone" dataKey="target" stroke={t.danger} strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Cible 80%"/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Radar KPI */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card title="Tableau de bord multi-KPI">
          <div style={{padding:16}}>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={t.cardBorder}/>
                <PolarAngleAxis dataKey="metric" tick={{fill:t.text,fontSize:12,fontWeight:600}}/>
                <Radar name="Performance" dataKey="value" stroke={t.accent} fill={t.accent} fillOpacity={0.2} strokeWidth={2}/>
                <Tooltip contentStyle={{background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:10,color:t.text,fontSize:13}}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Indicateurs clés">
          <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
            {[
              {label:"Taux de service",value:kpiStock.tauxSvc+"%",target:"≥ 95%",ok:kpiStock.tauxSvc>=95},
              {label:"TRS moyen annuel",value:trsMoy+"%",target:"≥ 80%",ok:trsMoy>=80},
              {label:"Mois objectif atteint",value:moisBonus+"/12",target:"≥ 9/12",ok:moisBonus>=9},
              {label:"Taux rupture",value:kpiStock.txRupture+"%",target:"≤ 2%",ok:kpiStock.txRupture<=2},
              {label:"Couverture stock",value:kpiStock.couvMoy+"j",target:"20-45j",ok:kpiStock.couvMoy>=20&&kpiStock.couvMoy<=45},
              {label:"Économies identifiées",value:kpiStock.ecoTotal+"k$",target:"> 10k$",ok:kpiStock.ecoTotal>10},
            ].map(kpi=>(
              <div key={kpi.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"10px 14px",background:kpi.ok?t.accent+"0A":t.danger+"0A",
                border:`1px solid ${kpi.ok?t.accent:t.danger}20`,borderRadius:10}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:t.text}}>{kpi.label}</div>
                  <div style={{fontSize:10,color:t.textMuted}}>Cible: {kpi.target}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:16,fontWeight:800,color:kpi.ok?t.accent:t.danger}}>{kpi.value}</div>
                  <div style={{fontSize:11,color:kpi.ok?t.accent:t.danger}}>{kpi.ok?"✅":"⚠️"}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 10. PAGE ABC/EOQ (Séance 3-4)
// ─────────────────────────────────────────────
function PageABCEOQ(){
  const{t}=useTheme();
  const[tab,setTab]=useState("abc");

  // Calculs ABC/EOQ
  const totalVal=ITEMS_FULL.reduce((s,i)=>s+i.val_annuelle,0);
  const sortedByVal=[...ITEMS_FULL].sort((a,b)=>b.val_annuelle-a.val_annuelle);

  let cum=0;
  const withCum=sortedByVal.map((item,i)=>{
    cum+=item.val_annuelle;
    return{...item,rank:i+1,cumPct:+(cum/totalVal*100).toFixed(2)};
  });

  const aItems=withCum.filter(i=>i.abc==="A");
  const bItems=withCum.filter(i=>i.abc==="B");
  const cItems=withCum.filter(i=>i.abc==="C");

  const abcStats=[
    {cls:"A",count:aItems.length,pctCount:+(aItems.length/ITEMS_FULL.length*100).toFixed(1),
      valSum:aItems.reduce((s,i)=>s+i.val_annuelle,0),
      pctVal:+(aItems.reduce((s,i)=>s+i.val_annuelle,0)/totalVal*100).toFixed(1)},
    {cls:"B",count:bItems.length,pctCount:+(bItems.length/ITEMS_FULL.length*100).toFixed(1),
      valSum:bItems.reduce((s,i)=>s+i.val_annuelle,0),
      pctVal:+(bItems.reduce((s,i)=>s+i.val_annuelle,0)/totalVal*100).toFixed(1)},
    {cls:"C",count:cItems.length,pctCount:+(cItems.length/ITEMS_FULL.length*100).toFixed(1),
      valSum:cItems.reduce((s,i)=>s+i.val_annuelle,0),
      pctVal:+(cItems.reduce((s,i)=>s+i.val_annuelle,0)/totalVal*100).toFixed(1)},
  ];

  // XYZ
  const xyzStats=[
    {cls:"X",items:ITEMS_FULL.filter(i=>i.xyz==="X"),desc:"Consommation stable"},
    {cls:"Y",items:ITEMS_FULL.filter(i=>i.xyz==="Y"),desc:"Consommation variable"},
    {cls:"Z",items:ITEMS_FULL.filter(i=>i.xyz==="Z"),desc:"Consommation aléatoire"},
  ];

  // EOQ simulation
  const[eoqD,setEoqD]=useState(10000);
  const[eoqS,setEoqS]=useState(50);
  const[eoqH,setEoqH]=useState(0.2);
  const[eoqC,setEoqC]=useState(100);
  const eoqCalc=Math.round(Math.sqrt((2*eoqD*eoqS)/(eoqH*eoqC)));
  const eoqCout=Math.round(Math.sqrt(2*eoqD*eoqS*eoqH*eoqC));

  // Courbe Pareto simulée — 400 articles, distribution réaliste (alpha=1.05)
  // Top 20% articles ≈ 78.5% valeur · Top 40% ≈ 88% valeur
  const paretoData=[{x:0.0,y:0.0},{x:1.5,y:43.38},{x:4.0,y:56.39},{x:6.5,y:63.12},{x:9.0,y:67.65},{x:11.5,y:71.05},{x:14.0,y:73.77},{x:16.5,y:76.04},{x:19.0,y:77.97},{x:20.0,y:78.5},{x:21.5,y:79.66},{x:24.0,y:81.16},{x:26.5,y:82.51},{x:29.0,y:83.73},{x:31.5,y:84.84},{x:34.0,y:85.87},{x:36.5,y:86.82},{x:39.0,y:87.71},{x:40.0,y:88.0},{x:41.5,y:88.53},{x:44.0,y:89.31},{x:46.5,y:90.05},{x:49.0,y:90.74},{x:51.5,y:91.4},{x:54.0,y:92.02},{x:56.5,y:92.62},{x:59.0,y:93.19},{x:61.5,y:93.73},{x:64.0,y:94.25},{x:66.5,y:94.75},{x:69.0,y:95.24},{x:71.5,y:95.7},{x:74.0,y:96.15},{x:76.5,y:96.58},{x:79.0,y:96.99},{x:81.5,y:97.4},{x:84.0,y:97.79},{x:86.5,y:98.17},{x:89.0,y:98.53},{x:91.5,y:98.89},{x:94.0,y:99.24},{x:96.5,y:99.58},{x:99.0,y:99.9},{x:99.75,y:100.0}];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      {/* Onglets */}
      <div style={{display:"flex",gap:2,background:t.card,border:`1px solid ${t.cardBorder}`,
        borderRadius:12,padding:4,width:"fit-content"}}>
        {[{k:"abc",l:"📊 Segmentation ABC"},{k:"xyz",l:"📈 Analyse XYZ"},{k:"eoq",l:"🔢 Calcul EOQ"},{k:"pareto",l:"📉 Courbe Pareto"}].map(b=>(
          <button key={b.k} onClick={()=>setTab(b.k)} style={{
            padding:"8px 16px",borderRadius:10,fontSize:12,fontWeight:600,
            cursor:"pointer",border:"none",transition:"all 0.2s",
            background:tab===b.k?t.accent:"transparent",
            color:tab===b.k?"#fff":t.textSub
          }}>{b.l}</button>
        ))}
      </div>

      {tab==="abc"&&(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* ABC KPI */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {abcStats.map(s=>(
              <Card key={s.cls}>
                <div style={{padding:20,textAlign:"center",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:ABC_COLORS[s.cls]}}/>
                  <div style={{fontSize:48,fontWeight:900,color:ABC_COLORS[s.cls],lineHeight:1,
                    opacity:0.15,position:"absolute",right:10,top:10}}>ABC</div>
                  <Badge color={ABC_COLORS[s.cls]} size="md">Classe {s.cls}</Badge>
                  <div style={{fontSize:32,fontWeight:800,color:t.text,margin:"12px 0 4px"}}>{s.count}</div>
                  <div style={{fontSize:13,color:t.textSub}}>articles ({s.pctCount}%)</div>
                  <div style={{fontSize:20,fontWeight:700,color:ABC_COLORS[s.cls],margin:"10px 0 2px"}}>
                    {Math.round(s.valSum/1000000*10)/10}M$
                  </div>
                  <div style={{fontSize:12,color:t.textSub}}>{s.pctVal}% de la valeur</div>
                  <div style={{marginTop:14}}>
                    <ProgressBar value={s.pctVal} max={100} color={ABC_COLORS[s.cls]}/>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Table articles A (prioritaires) */}
          <Card title="Classe A — Articles stratégiques (EOQ recommandé)" headerRight={
            <ExportBtn getData={()=>aItems.slice(0,20).map(i=>({SKU:i.sku,Article:i.article,
              "Valeur annuelle":i.val_annuelle,EOQ:i.eoq,"% cumulé":i.cumPct}))} filename="classe_A.csv"/>
          }>
            <div style={{overflowX:"auto",maxHeight:380,overflowY:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>
                  {["#","SKU","Article","Famille","Val. annuelle","% val","% cum","EOQ","ROP","Politique"].map(h=>(
                    <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,
                      textTransform:"uppercase",color:t.textMuted,borderBottom:`1px solid ${t.cardBorder}`,
                      position:"sticky",top:0,background:t.card}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {aItems.slice(0,20).map(item=>(
                    <tr key={item.id} style={{borderBottom:`1px solid ${t.cardBorder}15`}}>
                      <td style={{padding:"8px 14px",fontSize:11,color:t.textMuted}}>{item.rank}</td>
                      <td style={{padding:"8px 14px",fontSize:12,color:t.accent,fontWeight:700}}>{item.sku}</td>
                      <td style={{padding:"8px 14px",fontSize:12,color:t.text,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.article}</td>
                      <td style={{padding:"8px 14px",fontSize:11,color:t.textSub}}>{item.famille}</td>
                      <td style={{padding:"8px 14px",fontSize:12,color:t.text,textAlign:"right",fontWeight:600}}>{Math.round(item.val_annuelle/1000)}k$</td>
                      <td style={{padding:"8px 14px",fontSize:12,color:t.warning,textAlign:"right"}}>{+(item.val_annuelle/totalVal*100).toFixed(2)}%</td>
                      <td style={{padding:"8px 14px",fontSize:12,color:t.purple,textAlign:"right"}}>{item.cumPct}%</td>
                      <td style={{padding:"8px 14px",fontSize:12,color:t.info,textAlign:"right",fontWeight:700}}>{item.eoq}</td>
                      <td style={{padding:"8px 14px",fontSize:12,color:t.textSub,textAlign:"right"}}>{item.rop}</td>
                      <td style={{padding:"8px 14px",fontSize:11,color:t.textSub,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.politique}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab==="xyz"&&(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {xyzStats.map(s=>(
              <Card key={s.cls}>
                <div style={{padding:20,textAlign:"center"}}>
                  <Badge color={XYZ_COLORS[s.cls]} size="md">Classe {s.cls}</Badge>
                  <div style={{fontSize:12,color:t.textSub,marginTop:8}}>{s.desc}</div>
                  <div style={{fontSize:32,fontWeight:800,color:t.text,margin:"12px 0 4px"}}>{s.items.length}</div>
                  <div style={{fontSize:13,color:t.textSub}}>articles ({+(s.items.length/ITEMS_FULL.length*100).toFixed(0)}%)</div>
                </div>
              </Card>
            ))}
          </div>
          {/* Matrice ABC×XYZ */}
          <Card title="Matrice croisée ABC × XYZ — Politique recommandée">
            <div style={{padding:20,overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr>
                  <th style={{padding:14,border:`1px solid ${t.cardBorder}`,background:t.bg,color:t.textSub,fontSize:11}}></th>
                  {["X — Stable","Y — Variable","Z — Aléatoire"].map(h=>(
                    <th key={h} style={{padding:14,border:`1px solid ${t.cardBorder}`,background:t.bg,color:t.textSub,fontSize:11,textAlign:"center"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[
                    {cls:"A",cells:[
                      {pol:"EOQ + Contrat-cadre",risk:"Faible",color:t.accent},
                      {pol:"EOQ ajusté + revue mensuelle",risk:"Moyen",color:t.warning},
                      {pol:"Stock sécurité élevé + alerte",risk:"Élevé",color:t.danger}
                    ]},
                    {cls:"B",cells:[
                      {pol:"EOQ standard + suivi périodique",risk:"Faible",color:t.info},
                      {pol:"EOQ + reapprovisionnement auto",risk:"Moyen",color:t.warning},
                      {pol:"Stock tampon + commande urgente",risk:"Élevé",color:t.danger}
                    ]},
                    {cls:"C",cells:[
                      {pol:"MOQ mensuel groupé",risk:"Très faible",color:t.accent},
                      {pol:"Commande consolidée",risk:"Faible",color:t.info},
                      {pol:"À la demande",risk:"Variable",color:t.textSub}
                    ]},
                  ].map(row=>(
                    <tr key={row.cls}>
                      <td style={{padding:14,border:`1px solid ${t.cardBorder}`,
                        background:ABC_COLORS[row.cls]+"20",fontWeight:700,
                        color:ABC_COLORS[row.cls],textAlign:"center",fontSize:16}}>
                        Classe {row.cls}
                      </td>
                      {row.cells.map((cell,ci)=>(
                        <td key={ci} style={{padding:14,border:`1px solid ${t.cardBorder}`,
                          background:cell.color+"08",textAlign:"center",verticalAlign:"top"}}>
                          <div style={{fontSize:12,fontWeight:600,color:t.text,marginBottom:6}}>{cell.pol}</div>
                          <Badge color={cell.color}>Risque: {cell.risk}</Badge>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {tab==="eoq"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <Card title="Calculateur EOQ interactif">
            <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
              <div style={{padding:"14px 16px",background:t.bg,borderRadius:10,
                border:`1px solid ${t.cardBorder}`,fontSize:12,fontFamily:"monospace",color:t.accent}}>
                EOQ = √( (2 × D × S) / (H × C) )
              </div>
              {[
                {k:"eoqD",l:"D — Demande annuelle (unités)",v:eoqD,s:setEoqD,min:100,max:50000,step:100},
                {k:"eoqS",l:"S — Coût par commande ($CA)",v:eoqS,s:setEoqS,min:10,max:500,step:10},
                {k:"eoqH",l:"H — Taux de possession (%)",v:+(eoqH*100).toFixed(0),s:v=>setEoqH(v/100),min:5,max:50,step:5},
                {k:"eoqC",l:"C — Coût unitaire ($CA)",v:eoqC,s:setEoqC,min:1,max:500,step:1},
              ].map(f=>(
                <div key={f.k}>
                  <div style={{display:"flex",justifyContent:"space-between",
                    fontSize:12,color:t.textSub,marginBottom:6}}>
                    <span>{f.l}</span>
                    <strong style={{color:t.text}}>{f.v}</strong>
                  </div>
                  <input type="range" min={f.min} max={f.max} step={f.step}
                    value={f.v} onChange={e=>f.s(+e.target.value)}
                    style={{width:"100%",accentColor:t.accent}}/>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Résultat EOQ">
            <div style={{padding:20,display:"flex",flexDirection:"column",gap:16}}>
              <div style={{textAlign:"center",padding:24,background:t.accent+"10",
                border:`2px solid ${t.accent}40`,borderRadius:16}}>
                <div style={{fontSize:12,color:t.textSub,marginBottom:8}}>Quantité optimale de commande</div>
                <div style={{fontSize:52,fontWeight:900,color:t.accent,lineHeight:1}}>{eoqCalc}</div>
                <div style={{fontSize:14,color:t.textSub}}>unités par commande</div>
              </div>
              {[
                {l:"Coût total annuel optimal",v:(eoqCout).toLocaleString()+" $CA",c:t.text},
                {l:"Nb. commandes/an",v:Math.ceil(eoqD/eoqCalc),c:t.info},
                {l:"Fréquence",v:Math.round(365/Math.ceil(eoqD/eoqCalc))+" jours",c:t.purple},
                {l:"Stock moyen",v:Math.round(eoqCalc/2)+" unités",c:t.warning},
                {l:"Valeur stock moyen",v:Math.round(eoqCalc/2*eoqC).toLocaleString()+" $CA",c:t.text},
              ].map(r=>(
                <div key={r.l} style={{display:"flex",justifyContent:"space-between",
                  padding:"8px 12px",background:t.bg,borderRadius:8}}>
                  <span style={{fontSize:12,color:t.textSub}}>{r.l}</span>
                  <span style={{fontSize:13,fontWeight:700,color:r.c}}>{r.v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab==="pareto"&&(
        <Card title="Courbe de Pareto — Distribution cumulative valeur/articles">
          <div style={{padding:20}}>
            <div style={{marginBottom:16,fontSize:13,color:t.textSub,
              padding:"10px 16px",background:t.bg,borderRadius:8,
              border:`1px solid ${t.cardBorder}`}}>
              📐 Loi de Pareto : ~20% des articles représentent ~80% de la valeur totale du stock.
              Classe A = Priorité maximale de gestion et d'optimisation.
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={paretoData} margin={{top:10,right:20,left:0,bottom:10}}>
                <CartesianGrid strokeDasharray="3 3" stroke={t.cardBorder}/>
                <XAxis dataKey="x" tick={{fill:t.text,fontSize:12}} unit="%" axisLine={{stroke:t.cardBorder}} tickLine={false}/>
                <YAxis tick={{fill:t.text,fontSize:12}} unit="%" domain={[0,100]} axisLine={false} tickLine={false} width={42}/>
                <Tooltip contentStyle={{background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:10,color:t.text,fontSize:13}}
                  formatter={(v,n)=>[v.toFixed(1)+"%",n]}/>
                <Area type="monotone" dataKey="y" stroke={t.accent} fill={t.accent+"25"}
                  strokeWidth={2.5} name="Valeur cumulée %"/>
                <ReferenceLine x={20} stroke={ABC_COLORS.A} strokeDasharray="6 4" strokeWidth={2}
                  label={{value:"A | B", position:"insideTopLeft", fill:ABC_COLORS.A, fontSize:11, fontWeight:800, dy:-2}}/>
                <ReferenceLine x={40} stroke={ABC_COLORS.B} strokeDasharray="6 4" strokeWidth={2}
                  label={{value:"B | C", position:"insideTopLeft", fill:ABC_COLORS.B, fontSize:11, fontWeight:800, dy:-2}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// 12. PAGE FOURNISSEURS
// ─────────────────────────────────────────────
function PageSuppliers(){
  const{t}=useTheme();
  const{setSlideOver}=useData();

  const suppliersWithScore=SUPPLIERS.map(s=>({
    ...s,
    score:Math.round(s.conformite*0.6+(100-s.retard_pct)*0.2+((30-s.delai_moyen)/30*100)*0.2)
  }));

  const{sortCol,sortDir,handleSort,sortedData}=useSortable(suppliersWithScore,{});
  const actifs=suppliersWithScore.filter(s=>s.actif);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>
        <KpiCard icon="🏭" label="Fournisseurs actifs" value={actifs.length} sub={`sur ${SUPPLIERS.length}`} color={t.accent}/>
        <KpiCard icon="📅" label="Délai moyen" value={Math.round(actifs.reduce((s,x)=>s+x.delai_moyen,0)/actifs.length)+"j"} sub="actifs uniquement" color={t.info}/>
        <KpiCard icon="✅" label="Conformité moy." value={Math.round(actifs.reduce((s,x)=>s+x.conformite,0)/actifs.length)+"%"} sub="livraisons conformes" color={t.accent}/>
        <KpiCard icon="⚠️" label="À risque" value={suppliersWithScore.filter(s=>s.score<70).length} sub="score < 70" color={t.danger}/>
      </div>

      <Card title="Fournisseurs" headerRight={
        <ExportBtn getData={()=>sortedData.map(s=>({Nom:s.nom,Pays:s.pays,Contact:s.contact,
          "Délai moy.":s.delai_moyen,"Conformité %":s.conformite,"Retard %":s.retard_pct,
          Score:s.score,Actif:s.actif?"Oui":"Non"}))} filename="fournisseurs.csv"/>
      }>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {[["nom","Nom"],["pays","Pays"],["delai_moyen","Délai moy."],
                ["conformite","Conformité %"],["retard_pct","Retard %"],["score","Score"]].map(([k,l])=>(
                <SortTh key={k} col={k} label={l} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} t={t}/>
              ))}
              <th style={{padding:"10px 14px",fontSize:10,color:t.textMuted,borderBottom:`1px solid ${t.cardBorder}`}}>Barre</th>
              <th style={{padding:"10px 14px",fontSize:10,color:t.textMuted,borderBottom:`1px solid ${t.cardBorder}`}}>Statut</th>
            </tr></thead>
            <tbody>
              {sortedData.map(s=>(
                <tr key={s.id} onClick={()=>setSlideOver({type:"supplier",data:s})}
                  style={{borderBottom:`1px solid ${t.cardBorder}15`,cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:12,fontSize:13,fontWeight:700,color:t.text}}>{s.nom}</td>
                  <td style={{padding:12,fontSize:12,color:t.textSub}}>{s.pays}</td>
                  <td style={{padding:12,fontSize:13,color:t.text,textAlign:"right"}}>{s.delai_moyen}j</td>
                  <td style={{padding:12,fontSize:13,fontWeight:700,textAlign:"right",
                    color:s.conformite>=90?t.accent:s.conformite>=80?t.warning:t.danger}}>{s.conformite}%</td>
                  <td style={{padding:12,fontSize:13,textAlign:"right",
                    color:s.retard_pct>20?t.danger:s.retard_pct>10?t.warning:t.accent}}>{s.retard_pct}%</td>
                  <td style={{padding:12,fontSize:14,fontWeight:800,textAlign:"right",
                    color:s.score>=80?t.accent:s.score>=65?t.warning:t.danger}}>{s.score}</td>
                  <td style={{padding:12,minWidth:130}}>
                    <ProgressBar value={s.conformite} max={100}
                      color={s.conformite>=90?t.accent:s.conformite>=80?t.warning:t.danger}/>
                  </td>
                  <td style={{padding:12}}><Badge color={s.actif?t.accent:t.danger}>{s.actif?"Actif":"Inactif"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// 13. PAGE ORDERS (Séance 5 — Workflow PO)
// ─────────────────────────────────────────────
function PageOrders(){
  const{t}=useTheme();
  const{pos,transitionPO,setSlideOver}=useData();
  const[search,setSearch]=useState("");
  const[statusF,setStatusF]=useState([]);

  const filtered=useMemo(()=>{
    let d=pos;
    if(search){const s=search.toLowerCase();d=d.filter(p=>p.id.toLowerCase().includes(s)||p.article.toLowerCase().includes(s)||p.sku.toLowerCase().includes(s));}
    if(statusF.length)d=d.filter(p=>statusF.includes(p.statut));
    return d;
  },[pos,search,statusF]);

  const{sortCol,sortDir,handleSort,sortedData}=useSortable(filtered,ORDINAL_MAPS);

  const byStatus=useMemo(()=>{
    const m={};pos.forEach(p=>{m[p.statut]=(m[p.statut]||0)+1;});return m;
  },[pos]);

  // Workflow pipeline visuel
  const stages=["BROUILLON","A_VALIDER","ENVOYÉ","REÇU","CLOS"];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Pipeline visuel */}
      <Card title="Pipeline Purchase Orders">
        <div style={{padding:16,display:"flex",gap:4,overflowX:"auto"}}>
          {stages.map((stage,i)=>(
            <div key={stage} style={{flex:1,minWidth:100,display:"flex",alignItems:"center"}}>
              <div style={{flex:1,padding:"14px 12px",background:PO_STATUS_COLORS[stage]+"15",
                border:`2px solid ${PO_STATUS_COLORS[stage]}40`,borderRadius:12,textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:900,color:PO_STATUS_COLORS[stage]}}>{byStatus[stage]||0}</div>
                <div style={{fontSize:10,fontWeight:700,color:PO_STATUS_COLORS[stage],
                  textTransform:"uppercase",letterSpacing:"0.05em",marginTop:4}}>
                  {stage.replace("_"," ")}
                </div>
              </div>
              {i<stages.length-1&&(
                <div style={{fontSize:20,color:t.textMuted,padding:"0 4px",flexShrink:0}}>→</div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Filtres */}
      <Card noPad>
        <div style={{padding:14,display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <SearchInput value={search} onChange={setSearch} placeholder="PO, article, SKU…"/>
          <FilterPills options={stages} active={statusF}
            onToggle={v=>setStatusF(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v])}
            colorMap={PO_STATUS_COLORS}/>
          <span style={{marginLeft:"auto",fontSize:12,color:t.textSub}}>{sortedData.length} PO</span>
        </div>
      </Card>

      {/* Table */}
      <Card headerRight={
        <ExportBtn getData={()=>sortedData.map(p=>({ID:p.id,SKU:p.sku,Article:p.article,
          Fournisseur:p.supplier,Statut:p.statut,Qty:p.qty,
          "Prix négocié":p.prix_negocie,"Date création":p.date_creation}))}
          filename="purchase_orders.csv"/>
      }>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {[["id","PO"],["sku","SKU"],["article","Article"],["supplier","Fournisseur"],
                ["statut","Statut"],["qty","Qté"],["prix_negocie","Prix négocié"],["date_creation","Créé le"]].map(([k,l])=>(
                <SortTh key={k} col={k} label={l} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} t={t}/>
              ))}
              <th style={{padding:"10px 14px",fontSize:10,color:t.textMuted,borderBottom:`1px solid ${t.cardBorder}`}}>Action</th>
            </tr></thead>
            <tbody>
              {sortedData.map(po=>{
                const tr=PO_TRANSITIONS[po.statut];
                return(
                  <tr key={po.id} onClick={()=>setSlideOver({type:"po",data:po})}
                    style={{borderBottom:`1px solid ${t.cardBorder}15`,cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"9px 14px",fontSize:12,color:t.accent,fontWeight:700}}>{po.id}</td>
                    <td style={{padding:"9px 14px",fontSize:11,color:t.textSub}}>{po.sku}</td>
                    <td style={{padding:"9px 14px",fontSize:12,color:t.text,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{po.article}</td>
                    <td style={{padding:"9px 14px",fontSize:12,color:t.textSub}}>{po.supplier}</td>
                    <td style={{padding:"9px 14px"}}><Badge color={PO_STATUS_COLORS[po.statut]}>{po.statut}</Badge></td>
                    <td style={{padding:"9px 14px",fontSize:12,color:t.text,textAlign:"right"}}>{po.qty}</td>
                    <td style={{padding:"9px 14px",fontSize:12,color:t.text,textAlign:"right"}}>{po.prix_negocie?.toLocaleString()} $CA</td>
                    <td style={{padding:"9px 14px",fontSize:11,color:t.textSub}}>{po.date_creation}</td>
                    <td style={{padding:"9px 14px"}} onClick={e=>e.stopPropagation()}>
                      {tr?(
                        <Btn size="sm" color={PO_STATUS_COLORS[tr.next]} onClick={()=>transitionPO(po.id)}>{tr.label}</Btn>
                      ):<span style={{color:t.textMuted,fontSize:11}}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// 14. PAGE AUDIT / JOURNAL (Séance 5)
// ─────────────────────────────────────────────
function PageAudit(){
  const{t}=useTheme();
  const{events}=useData();
  const[filter,setFilter]=useState([]);

  const filtered=filter.length?events.filter(e=>filter.includes(e.level)):events;
  const{sortCol,sortDir,handleSort,sortedData}=useSortable(filtered,ORDINAL_MAPS);

  const levelColors={INFO:t.info,WARNING:t.warning,ERROR:t.danger,CRITICAL:"#DC2626"};
  const counts={
    total:events.length,
    warn:events.filter(e=>e.level==="WARNING").length,
    err:events.filter(e=>e.level==="ERROR").length,
    crit:events.filter(e=>e.level==="CRITICAL").length
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
        <KpiCard icon="📋" label="Total événements" value={counts.total} color={t.info}/>
        <KpiCard icon="⚠️" label="Warnings" value={counts.warn} color={t.warning}/>
        <KpiCard icon="❌" label="Erreurs" value={counts.err} color={t.danger}/>
        <KpiCard icon="🚨" label="Critiques" value={counts.crit} color="#DC2626"/>
      </div>
      <Card noPad>
        <div style={{padding:14}}>
          <FilterPills options={["INFO","WARNING","ERROR","CRITICAL"]}
            active={filter}
            onToggle={v=>setFilter(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v])}
            colorMap={levelColors}/>
        </div>
      </Card>
      <Card title="Journal d'audit" headerRight={
        <ExportBtn getData={()=>sortedData.map(e=>({ID:e.id,Date:e.date,Type:e.type,
          Entité:e.entity,Message:e.message,Niveau:e.level}))} filename="audit.csv"/>
      }>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {[["id","ID"],["date","Date/Heure"],["level","Niveau"],
                ["type","Type"],["entity","Entité"],["message","Message"]].map(([k,l])=>(
                <SortTh key={k} col={k} label={l} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} t={t}/>
              ))}
            </tr></thead>
            <tbody>
              {sortedData.map(e=>(
                <tr key={e.id} style={{borderBottom:`1px solid ${t.cardBorder}15`,
                  background:e.level==="CRITICAL"?t.danger+"08":"transparent"}}>
                  <td style={{padding:"9px 14px",fontSize:11,color:t.textMuted}}>{e.id}</td>
                  <td style={{padding:"9px 14px",fontSize:11,color:t.textSub,whiteSpace:"nowrap"}}>{e.date}</td>
                  <td style={{padding:"9px 14px"}}><Badge color={levelColors[e.level]||t.info}>{e.level}</Badge></td>
                  <td style={{padding:"9px 14px",fontSize:12,color:t.textSub}}>{e.type}</td>
                  <td style={{padding:"9px 14px",fontSize:12,color:t.accent,fontWeight:700}}>{e.entity}</td>
                  <td style={{padding:"9px 14px",fontSize:12,color:t.text,maxWidth:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// 15. PAGE RÈGLES
// ─────────────────────────────────────────────
function PageRules(){
  const{t}=useTheme();

  const rules=[
    {n:1,si:"Net = Physique + Transit − Réservé < Seuil_min",alors:"Génère message réapprovisionnement automatique",level:"INFO"},
    {n:2,si:"PO BROUILLON ou A_VALIDER existe pour ce SKU",alors:"Bloquer création + journaliser WARNING",level:"WARNING"},
    {n:3,si:"Quantité commandée > EOQ × 2",alors:"Créer tâche approbation managériale + WARNING",level:"WARNING"},
    {n:4,si:"Fournisseur sélectionné est inactif",alors:"Bloquer création PO + journaliser ERROR",level:"ERROR"},
    {n:5,si:"Quantité ≤ 0",alors:"Refuser action + journaliser ERROR",level:"ERROR"},
    {n:6,si:"Transition BROUILLON → ENVOYÉ directe",alors:"Impossible — passe obligatoirement par A_VALIDER",level:"WARNING"},
    {n:7,si:"PO statut CLOS",alors:"Aucun bouton d'action disponible — immuable",level:"INFO"},
    {n:8,si:"Toute violation de garde-fou",alors:"Événement d'audit créé avec niveau approprié",level:"INFO"},
  ];

  const formulas=[
    {name:"Net disponible",f:"Net = stock_physique + stock_transit − stock_réservé",color:t.accent},
    {name:"EOQ",f:"EOQ = √( (2 × D × S) / (H × C) )   où D=demande, S=coût cmd, H=taux possession, C=coût unit",color:t.info},
    {name:"ROP (Point de commande)",f:"ROP = (D / 365 × Lead_time) + Stock_sécurité",color:t.purple},
    {name:"Couverture stock",f:"Couverture = Stock_net / (Demande / 365)   [en jours]",color:t.warning},
    {name:"TRS",f:"TRS = Disponibilité(%) × Performance(%) × Qualité(%)   [cible: ≥ 80%]",color:t.accent},
    {name:"ABC — Classe A",f:"Articles représentant ≤ 80% de la valeur annuelle cumulée",color:ABC_COLORS.A},
    {name:"ABC — Classe B",f:"Articles entre 80% et 95% de la valeur annuelle cumulée",color:ABC_COLORS.B},
    {name:"ABC — Classe C",f:"Articles > 95% de la valeur annuelle cumulée",color:ABC_COLORS.C},
    {name:"Score fournisseur",f:"Score = Conformité × 0.6 + (100−Retard%) × 0.2 + ((30−Délai)/30×100) × 0.2",color:t.purple},
  ];

  const levelColors={INFO:t.info,WARNING:t.warning,ERROR:t.danger};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Card title="⚙️ Règles métier actives (Garde-fous)">
        <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
          {rules.map(r=>(
            <div key={r.n} style={{display:"flex",gap:14,alignItems:"flex-start",
              padding:"12px 16px",background:levelColors[r.level]+"08",
              border:`1px solid ${levelColors[r.level]}30`,borderRadius:12}}>
              <div style={{width:26,height:26,borderRadius:8,background:levelColors[r.level]+"20",
                color:levelColors[r.level],display:"flex",alignItems:"center",
                justifyContent:"center",fontWeight:800,fontSize:12,flexShrink:0}}>{r.n}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,color:t.textSub,marginBottom:4}}>
                  <span style={{color:t.warning,fontWeight:700}}>SI </span>{r.si}
                </div>
                <div style={{fontSize:12,color:t.text}}>
                  <span style={{color:t.accent,fontWeight:700}}>ALORS </span>{r.alors}
                </div>
              </div>
              <Badge color={levelColors[r.level]}>{r.level}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card title="📐 Formules de calcul (BNMP / TRS / ABC / EOQ)">
        <div style={{padding:16,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:10}}>
          {formulas.map(f=>(
            <div key={f.name} style={{padding:"14px 16px",background:t.bg,borderRadius:12,
              border:`1px solid ${f.color}30`}}>
              <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.07em",
                color:f.color,marginBottom:8}}>{f.name}</div>
              <div style={{fontFamily:"'Courier New',monospace",fontSize:12,color:t.text,lineHeight:1.7,
                background:f.color+"08",padding:"8px 12px",borderRadius:8}}>{f.f}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Scénarios UAT */}
      <Card title="🧪 Scénarios UAT — 5 cas de test">
        <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
          {[
            {n:1,titre:"Calcul Net disponible",etapes:["Définir physique=100, transit=20, réservé=30","Vérifier Net = 100+20−30 = 90","Comparer au seuil min"],attendu:"Net = 90 · Alerte si 90 < seuil",status:"✅"},
            {n:2,titre:"Création PO avec garde-fou doublon",etapes:["Créer PO BROUILLON pour SKU-0001","Tenter créer 2ème PO pour SKU-0001","Vérifier blocage + log WARNING"],attendu:"PO2 bloqué · Event E-XXX créé",status:"✅"},
            {n:3,titre:"Workflow PO complet",etapes:["Créer PO BROUILLON","Cliquer 'Soumettre' → A_VALIDER","Cliquer 'Envoyer' → ENVOYÉ","Cliquer 'Réceptionner' → REÇU"],attendu:"Transitions sans erreur · Journal OK",status:"✅"},
            {n:4,titre:"EOQ calculateur",etapes:["D=10000, S=50, H=20%, C=100","EOQ = √(2×10000×50/(0.2×100))","Résultat attendu: 224 unités"],attendu:"EOQ = 224 · Coût total = 4472 $CA",status:"✅"},
            {n:5,titre:"Alerte rupture automatique",etapes:["Ajouter article avec stock_physique=-100","Vérifier statut=Rupture","Vérifier apparition dans alertes dashboard"],attendu:"Statut=Rupture · KPI mis à jour",status:"✅"},
          ].map(t_=>(
            <div key={t_.n} style={{padding:"14px 16px",background:t.bg,borderRadius:12,
              border:`1px solid ${t.cardBorder}`,display:"flex",gap:16}}>
              <div style={{width:32,height:32,borderRadius:10,background:t.accent+"20",
                color:t.accent,display:"flex",alignItems:"center",justifyContent:"center",
                fontWeight:800,fontSize:13,flexShrink:0}}>#{t_.n}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:8}}>{t_.titre}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {t_.etapes.map((e,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:11,color:t.textSub}}>{i+1}. {e}</span>
                      {i<t_.etapes.length-1&&<span style={{color:t.textMuted}}>→</span>}
                    </div>
                  ))}
                </div>
                <div style={{marginTop:8,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:11,color:t.textMuted}}>Résultat attendu:</span>
                  <span style={{fontSize:11,fontWeight:600,color:t.accent}}>{t_.attendu}</span>
                  <Badge color={t.accent}>{t_.status}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────
// 16. SLIDEOVER DETAIL
// ─────────────────────────────────────────────
function SlideOverContent({data}){
  const{t}=useTheme();
  if(!data)return null;
  const{type,data:d}=data;

  const Row=({label,value,color})=>(
    <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",
      borderBottom:`1px solid ${t.cardBorder}20`}}>
      <span style={{fontSize:12,color:t.textSub}}>{label}</span>
      <span style={{fontSize:12,fontWeight:700,color:color||t.text}}>{value??"-"}</span>
    </div>
  );

  if(type==="item")return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <Badge color={ABC_COLORS[d.abc]} size="md">ABC: {d.abc}</Badge>
          {d.xyz&&<Badge color={XYZ_COLORS[d.xyz]} size="md">XYZ: {d.xyz}</Badge>}
        </div>
        <h2 style={{margin:"8px 0 4px",fontSize:18,fontWeight:800,color:t.text}}>{d.article}</h2>
        <div style={{fontSize:13,color:t.textSub}}>{d.sku} — {d.famille}</div>
      </div>
      <Badge color={STATUS_COLORS[d.statut_service]} size="md">{d.statut_service}</Badge>
      {d.msg_reappro&&(
        <div style={{margin:"12px 0",padding:"10px 14px",background:t.warning+"12",
          border:`1px solid ${t.warning}40`,borderRadius:10,fontSize:11,color:t.text}}>
          {d.msg_reappro}
        </div>
      )}
      <div style={{marginTop:16}}>
        <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:t.accent,
          letterSpacing:"0.07em",marginBottom:10}}>📦 Stocks</div>
        <Row label="Stock physique" value={d.stock_physique}/>
        <Row label="Stock transit" value={d.stock_transit||0} color={d.stock_transit>0?t.info:t.textMuted}/>
        <Row label="Stock réservé" value={d.stock_reserve||0} color={d.stock_reserve>0?t.warning:t.textMuted}/>
        <Row label="Net disponible" value={d.stock_net}
          color={d.stock_net<=0?t.danger:d.stock_net<d.seuil_min?t.warning:t.accent}/>
        <Row label="Seuil minimum" value={d.seuil_min}/>
        <Row label="Couverture" value={d.couverture+"j"}
          color={d.couverture<15?t.danger:d.couverture<30?t.warning:t.text}/>
        <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:t.info,
          letterSpacing:"0.07em",margin:"14px 0 10px"}}>📐 BNMP</div>
        <Row label="EOQ" value={d.eoq} color={t.info}/>
        <Row label="ROP" value={d.rop}/>
        <Row label="Lead time" value={d.lead_time+"j"}/>
        <Row label="Stock sécurité" value={d.stock_secu}/>
        <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:t.purple,
          letterSpacing:"0.07em",margin:"14px 0 10px"}}>🍁 Finance</div>
        <Row label="Coût unitaire" value={d.cout_unit?.toFixed(2)+" $CA"}/>
        <Row label="Valeur annuelle" value={Math.round(d.val_annuelle/1000)+"k$"}/>
        <Row label="Économie EOQ" value={d.economie+" $CA"} color={t.accent}/>
        <Row label="Politique achat" value={d.politique}/>
      </div>
    </div>
  );

  if(type==="po")return(
    <div>
      <div style={{marginBottom:16}}>
        <Badge color={PO_STATUS_COLORS[d.statut]} size="md">{d.statut}</Badge>
        <h2 style={{margin:"8px 0 4px",fontSize:18,fontWeight:800,color:t.text}}>{d.id}</h2>
        <div style={{fontSize:13,color:t.textSub}}>{d.article}</div>
      </div>
      {[
        {l:"SKU",v:d.sku},{l:"Fournisseur",v:d.supplier},
        {l:"Quantité",v:d.qty},{l:"Prix négocié",v:d.prix_negocie?.toLocaleString()+" $CA"},
        {l:"Prix payé",v:d.prix_paye?d.prix_paye?.toLocaleString()+" $CA":"—"},
        {l:"Date création",v:d.date_creation},{l:"Date validation",v:d.date_validation||"—"},
        {l:"Date envoi",v:d.date_envoi||"—"},{l:"Date réception",v:d.date_reception||"—"},
      ].map(r=>(
        <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",
          borderBottom:`1px solid ${t.cardBorder}20`}}>
          <span style={{fontSize:12,color:t.textSub}}>{r.l}</span>
          <span style={{fontSize:12,fontWeight:700,color:t.text}}>{r.v}</span>
        </div>
      ))}
      {/* Workflow stepper */}
      <div style={{marginTop:20}}>
        <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:t.accent,letterSpacing:"0.07em",marginBottom:12}}>Workflow</div>
        <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
          {["BROUILLON","A_VALIDER","ENVOYÉ","REÇU","CLOS"].map((stage,i,arr)=>{
            const ord=ORDINAL_MAPS.statut;
            const cur=ord[d.statut];
            const stg=ord[stage];
            const done=stg<cur;const active=stg===cur;
            return(
              <div key={stage} style={{display:"flex",alignItems:"center",gap:4}}>
                <div style={{
                  padding:"4px 10px",borderRadius:8,fontSize:10,fontWeight:700,
                  background:active?PO_STATUS_COLORS[stage]:done?PO_STATUS_COLORS[stage]+"20":"transparent",
                  border:`1px solid ${active||done?PO_STATUS_COLORS[stage]:t.cardBorder}`,
                  color:active?t.text:done?PO_STATUS_COLORS[stage]:t.textMuted
                }}>{done?"✓ ":""}{stage.replace("_"," ")}</div>
                {i<arr.length-1&&<span style={{color:t.textMuted,fontSize:10}}>→</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if(type==="supplier")return(
    <div>
      <div style={{marginBottom:16}}>
        <Badge color={d.actif?t.accent:t.danger} size="md">{d.actif?"Actif":"Inactif"}</Badge>
        <h2 style={{margin:"8px 0 4px",fontSize:18,fontWeight:800,color:t.text}}>{d.nom}</h2>
        <div style={{fontSize:13,color:t.textSub}}>{d.pays}</div>
      </div>
      {[
        {l:"Contact",v:d.contact},{l:"Délai moyen",v:d.delai_moyen+" j"},
        {l:"Conformité",v:d.conformite+"%",c:d.conformite>=90?t.accent:d.conformite>=80?t.warning:t.danger},
        {l:"Retard %",v:d.retard_pct+"%",c:d.retard_pct>20?t.danger:d.retard_pct>10?t.warning:t.accent},
        {l:"Score global",v:d.score||Math.round(d.conformite*0.6+(100-d.retard_pct)*0.2+((30-d.delai_moyen)/30*100)*0.2)},
      ].map(r=>(
        <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",
          borderBottom:`1px solid ${t.cardBorder}20`}}>
          <span style={{fontSize:12,color:t.textSub}}>{r.l}</span>
          <span style={{fontSize:12,fontWeight:700,color:r.c||t.text}}>{r.v}</span>
        </div>
      ))}
      <div style={{marginTop:16}}>
        <ProgressBar value={d.conformite} max={100}
          color={d.conformite>=90?t.accent:d.conformite>=80?t.warning:t.danger}
          label="Taux de conformité"/>
      </div>
    </div>
  );
  return null;
}

// ─────────────────────────────────────────────
// 16b. PAGE STOCK ÉDITABLE (grille inline)
// ─────────────────────────────────────────────
function PageStockEditable() {
  const { t } = useTheme();
  const { addToast, createPO, setSlideOver } = useData();

  // Colonnes éditables manuellement
  const EDITABLE_COLS = [
    { key: "stock_physique", label: "Physique",  type: "number", color: t.text },
    { key: "stock_transit",  label: "Transit",   type: "number", color: t.info },
    { key: "stock_reserve",  label: "Réservé",   type: "number", color: t.warning },
    { key: "seuil_min",      label: "Seuil min", type: "number", color: t.textSub },
  ];

  // État local — copie éditable de ITEMS_FULL
  const [rows, setRows] = useState(() =>
    ITEMS_FULL.map(i => ({ ...i }))
  );

  // Cellule en cours d'édition : { rowId, col }
  const [editing, setEditing] = useState(null);
  // Valeur temporaire pendant l'édition
  const [draft, setDraft]     = useState("");
  const inputRef = useRef(null);

  // Filtres
  const [search, setSearch]   = useState("");
  const [abcF,   setAbcF]     = useState([]);
  const [famF,   setFamF]     = useState([]);

  // Historique undo (simple stack)
  const [history, setHistory] = useState([]);

  // Recalcul dérivé
  const recalc = (row) => {
    const net = (Number(row.stock_physique) || 0)
              + (Number(row.stock_transit)  || 0)
              - (Number(row.stock_reserve)  || 0);
    const couv = row.demande > 0 ? +(net / (row.demande / 365)).toFixed(1) : 0;
    const statut = net <= 0 ? "Rupture" : net < row.seuil_min ? "Sous seuil" : "Conforme";
    const priorite = statut === "Conforme" ? "Moyenne" : "Haute";
    return { ...row, stock_net: net, couverture: couv, statut_service: statut, priorite };
  };

  // Démarrer l'édition d'une cellule
  const startEdit = (rowId, col, currentVal) => {
    setEditing({ rowId, col });
    setDraft(String(currentVal ?? ""));
    setTimeout(() => inputRef.current?.select(), 20);
  };

  // Valider l'édition
  const commitEdit = () => {
    if (!editing) return;
    const { rowId, col } = editing;
    setHistory(h => [...h.slice(-19), rows.map(r => ({ ...r }))]);
    setRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      const updated = { ...r, [col]: col === "article" ? draft : Number(draft) || 0 };
      return recalc(updated);
    }));
    setEditing(null);
    addToast("Cellule mise à jour ✓");
  };

  // Annuler
  const cancelEdit = () => setEditing(null);

  // Undo
  const undo = () => {
    if (!history.length) return;
    setRows(history[history.length - 1]);
    setHistory(h => h.slice(0, -1));
    addToast("Modification annulée", "warn");
  };

  // Réinitialiser tout
  const resetAll = () => {
    setHistory(h => [...h.slice(-19), rows.map(r => ({ ...r }))]);
    setRows(ITEMS_FULL.map(i => ({ ...i })));
    addToast("Stock réinitialisé aux valeurs d'origine", "warn");
  };

  // Export CSV
  const exportCSV = () => {
    const cols = ["sku","article","famille","abc","stock_physique","stock_transit","stock_reserve","stock_net","seuil_min","couverture","statut_service"];
    const csv = ["\uFEFF" + cols.join(";"),
      ...filtered.map(r => cols.map(c => r[c] ?? "").join(";"))
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    a.download = "stock_editable.csv"; a.click();
  };

  // Filtrage
  const filtered = useMemo(() => {
    let d = rows;
    if (search) { const s = search.toLowerCase(); d = d.filter(r => r.sku.toLowerCase().includes(s) || r.article.toLowerCase().includes(s)); }
    if (abcF.length) d = d.filter(r => abcF.includes(r.abc));
    if (famF.length) d = d.filter(r => famF.includes(r.famille));
    return d;
  }, [rows, search, abcF, famF]);

  // Stats rapides
  const alertes   = filtered.filter(r => r.statut_service !== "Conforme").length;
  const ruptures  = filtered.filter(r => r.statut_service === "Rupture").length;
  const modifiees = rows.filter((r, i) => {
    const orig = ITEMS_FULL[i];
    return orig && (r.stock_physique !== orig.stock_physique || r.stock_transit !== orig.stock_transit || r.stock_reserve !== orig.stock_reserve || r.seuil_min !== orig.seuil_min);
  }).length;

  // Composant cellule éditable
  const EditableCell = ({ row, col, align = "right" }) => {
    const isEditing = editing?.rowId === row.id && editing?.col === col;
    const val = row[col];
    const colCfg = EDITABLE_COLS.find(c => c.key === col);
    const isChanged = ITEMS_FULL.find(i => i.id === row.id)?.[col] !== val;

    if (isEditing) {
      return (
        <td style={{ padding: "2px 6px" }}>
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") cancelEdit();
              if (e.key === "Tab") { e.preventDefault(); commitEdit(); }
            }}
            style={{
              width: 80, padding: "4px 8px", borderRadius: 6, fontSize: 12,
              fontWeight: 700, textAlign: "right",
              background: t.accent + "18", border: `2px solid ${t.accent}`,
              color: t.text, outline: "none", fontFamily: "inherit"
            }}
          />
        </td>
      );
    }

    return (
      <td
        onClick={() => startEdit(row.id, col, val)}
        title="Cliquer pour modifier"
        style={{
          padding: "7px 14px", fontSize: 12, textAlign: align,
          cursor: "text", color: isChanged ? t.accent : colCfg?.color || t.text,
          fontWeight: isChanged ? 700 : 400,
          borderBottom: `1px solid ${t.cardBorder}15`,
          transition: "background 0.1s",
          position: "relative",
        }}
        onMouseEnter={e => e.currentTarget.style.background = t.accent + "10"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {isChanged && (
          <span style={{
            position: "absolute", top: 4, right: 4,
            width: 5, height: 5, borderRadius: "50%",
            background: t.accent, opacity: 0.8
          }} />
        )}
        {val ?? 0}
      </td>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Barre d'outils */}
      <div style={{
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
        padding: "14px 18px", background: t.card,
        border: `1px solid ${t.cardBorder}`, borderRadius: 16, boxShadow: t.shadow
      }}>
        {/* Recherche */}
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="SKU ou article…"
            style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10,
              padding: "7px 12px 7px 32px", color: t.text, fontSize: 13, outline: "none", width: 200 }} />
        </div>

        {/* Filtres ABC */}
        <div style={{ display: "flex", gap: 5 }}>
          {["A","B","C"].map(cls => (
            <button key={cls} onClick={() => setAbcF(p => p.includes(cls) ? p.filter(x => x !== cls) : [...p, cls])}
              style={{
                padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
                border: `1px solid ${abcF.includes(cls) ? ABC_COLORS[cls] : t.cardBorder}`,
                background: abcF.includes(cls) ? ABC_COLORS[cls] + "22" : "transparent",
                color: abcF.includes(cls) ? ABC_COLORS[cls] : t.textSub
              }}>{cls}</button>
          ))}
        </div>

        {/* Stats inline */}
        <div style={{ display: "flex", gap: 14, marginLeft: 8 }}>
          <span style={{ fontSize: 12, color: t.textSub }}>{filtered.length} articles</span>
          {modifiees > 0 && <span style={{ fontSize: 12, color: t.accent, fontWeight: 700 }}>✏️ {modifiees} modifié{modifiees > 1 ? "s" : ""}</span>}
          {ruptures > 0 && <span style={{ fontSize: 12, color: t.danger, fontWeight: 700 }}>🔴 {ruptures} rupture{ruptures > 1 ? "s" : ""}</span>}
          {alertes > ruptures && <span style={{ fontSize: 12, color: t.warning, fontWeight: 700 }}>⚠️ {alertes - ruptures} sous seuil</span>}
        </div>

        {/* Actions */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={undo} disabled={!history.length}
            title="Annuler la dernière modification"
            style={{
              padding: "6px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${t.cardBorder}`, background: "transparent",
              color: history.length ? t.textSub : t.textMuted, opacity: history.length ? 1 : 0.4
            }}>↩ Annuler</button>
          <button onClick={resetAll}
            style={{
              padding: "6px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${t.danger}`, background: t.danger + "12", color: t.danger
            }}>🔄 Reset</button>
          <button onClick={exportCSV}
            style={{
              padding: "6px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: `1px solid ${t.accent}`, background: t.accent + "15", color: t.accent
            }}>↓ CSV</button>
        </div>
      </div>

      {/* Légende */}
      <div style={{
        padding: "10px 16px", background: t.card, border: `1px solid ${t.cardBorder}`,
        borderRadius: 12, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center"
      }}>
        <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Mode édition inline</span>
        <span style={{ fontSize: 12, color: t.textSub }}>👆 Cliquez sur une cellule <strong style={{ color: t.accent }}>colorée</strong> pour la modifier</span>
        <span style={{ fontSize: 12, color: t.textSub }}>⏎ <kbd style={{ padding: "1px 5px", borderRadius: 4, background: t.bg, border: `1px solid ${t.cardBorder}`, fontSize: 10 }}>Entrée</kbd> pour valider · <kbd style={{ padding: "1px 5px", borderRadius: 4, background: t.bg, border: `1px solid ${t.cardBorder}`, fontSize: 10 }}>Échap</kbd> pour annuler · <kbd style={{ padding: "1px 5px", borderRadius: 4, background: t.bg, border: `1px solid ${t.cardBorder}`, fontSize: 10 }}>Tab</kbd> pour passer à la suite</span>
        <span style={{ fontSize: 12, color: t.textSub, marginLeft: "auto" }}>
          <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: t.accent, marginRight: 5, verticalAlign: "middle" }} />
          Point = valeur modifiée
        </span>
      </div>

      {/* Grille principale */}
      <div style={{
        background: t.card, border: `1px solid ${t.cardBorder}`,
        borderRadius: 16, overflow: "hidden", boxShadow: t.shadow
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.bg }}>
                {/* Colonnes fixes */}
                {[
                  { label: "SKU",     w: 100 },
                  { label: "Article", w: 180 },
                  { label: "Famille", w: 100 },
                  { label: "ABC",     w: 55  },
                ].map(h => (
                  <th key={h.label} style={{
                    padding: "11px 14px", textAlign: "left", fontSize: 10, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.07em", color: t.textMuted,
                    borderBottom: `2px solid ${t.cardBorder}`, width: h.w, whiteSpace: "nowrap"
                  }}>{h.label}</th>
                ))}

                {/* Colonnes éditables */}
                {EDITABLE_COLS.map(c => (
                  <th key={c.key} style={{
                    padding: "11px 14px", textAlign: "right", fontSize: 10, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    color: c.color, borderBottom: `2px solid ${t.cardBorder}`,
                    whiteSpace: "nowrap"
                  }}>
                    ✏️ {c.label}
                  </th>
                ))}

                {/* Colonnes calculées (lecture seule) */}
                {[
                  { label: "Net dispo", color: t.accent },
                  { label: "Couv. (j)", color: t.purple },
                  { label: "Statut",    color: t.textMuted },
                ].map(h => (
                  <th key={h.label} style={{
                    padding: "11px 14px", textAlign: "right", fontSize: 10, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    color: h.color, borderBottom: `2px solid ${t.cardBorder}`,
                    whiteSpace: "nowrap"
                  }}>
                    🔒 {h.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((row, idx) => {
                const netColor = row.stock_net <= 0 ? t.danger : row.stock_net < row.seuil_min ? t.warning : t.accent;
                const rowBg = row.statut_service === "Rupture"
                  ? t.danger + "06"
                  : row.statut_service === "Sous seuil"
                  ? t.warning + "04"
                  : "transparent";
                return (
                  <tr key={row.id} style={{ background: rowBg, transition: "background 0.1s" }}>
                    {/* SKU */}
                    <td style={{ padding: "7px 14px", fontSize: 12, color: t.accent, fontWeight: 700, borderBottom: `1px solid ${t.cardBorder}15`, whiteSpace: "nowrap" }}>
                      {row.sku}
                    </td>
                    {/* Article — aussi éditable */}
                    <td
                      onClick={() => startEdit(row.id, "article", row.article)}
                      title="Cliquer pour renommer"
                      style={{
                        padding: "7px 14px", fontSize: 12, color: t.text, cursor: "text",
                        maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        borderBottom: `1px solid ${t.cardBorder}15`
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = t.accent + "10"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {editing?.rowId === row.id && editing?.col === "article" ? (
                        <input
                          ref={inputRef} value={draft} onChange={e => setDraft(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={e => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") cancelEdit(); }}
                          style={{
                            width: "100%", padding: "3px 7px", borderRadius: 6, fontSize: 12,
                            background: t.accent + "18", border: `2px solid ${t.accent}`,
                            color: t.text, outline: "none", fontFamily: "inherit"
                          }}
                        />
                      ) : row.article}
                    </td>
                    {/* Famille */}
                    <td style={{ padding: "7px 14px", fontSize: 11, color: t.textSub, borderBottom: `1px solid ${t.cardBorder}15` }}>
                      {row.famille}
                    </td>
                    {/* ABC */}
                    <td style={{ padding: "7px 14px", borderBottom: `1px solid ${t.cardBorder}15` }}>
                      <span style={{
                        display: "inline-block", borderRadius: 20, fontWeight: 700, fontSize: 10,
                        padding: "2px 8px", backgroundColor: ABC_COLORS[row.abc] + "20",
                        color: ABC_COLORS[row.abc], border: `1px solid ${ABC_COLORS[row.abc]}40`
                      }}>{row.abc}</span>
                    </td>

                    {/* Cellules éditables */}
                    {EDITABLE_COLS.map(c => (
                      <EditableCell key={c.key} row={row} col={c.key} />
                    ))}

                    {/* Net dispo — calculé */}
                    <td style={{
                      padding: "7px 14px", fontSize: 12, fontWeight: 800, textAlign: "right",
                      color: netColor, borderBottom: `1px solid ${t.cardBorder}15`,
                      fontVariantNumeric: "tabular-nums"
                    }}>
                      {row.stock_net}
                    </td>

                    {/* Couverture — calculée */}
                    <td style={{
                      padding: "7px 14px", fontSize: 12, fontWeight: 600, textAlign: "right",
                      color: row.couverture < 15 ? t.danger : row.couverture < 30 ? t.warning : t.purple,
                      borderBottom: `1px solid ${t.cardBorder}15`
                    }}>
                      {row.couverture}j
                    </td>

                    {/* Statut — calculé */}
                    <td style={{ padding: "7px 14px", textAlign: "right", borderBottom: `1px solid ${t.cardBorder}15` }}>
                      <span style={{
                        display: "inline-block", borderRadius: 20, fontWeight: 700, fontSize: 10,
                        padding: "2px 9px",
                        backgroundColor: STATUS_COLORS[row.statut_service] + "20",
                        color: STATUS_COLORS[row.statut_service],
                        border: `1px solid ${STATUS_COLORS[row.statut_service]}40`
                      }}>{row.statut_service}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau */}
        <div style={{
          padding: "12px 18px", borderTop: `1px solid ${t.cardBorder}`,
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <span style={{ fontSize: 11, color: t.textMuted }}>
            {filtered.length} article{filtered.length > 1 ? "s" : ""} affichés · {modifiees} modifié{modifiees > 1 ? "s" : ""}
          </span>
          <span style={{ fontSize: 11, color: t.textMuted }}>
            Net = Physique + Transit − Réservé · Statut recalculé automatiquement
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 16c. PAGE SURVEILLANCE CONTINUE
// ─────────────────────────────────────────────

// ── Données constantes ────────────────────────
const ECART_TYPES = [
  { id: "ecart",    label: "Écart inventaire",   icon: "📊", color: "#F59E0B" },
  { id: "retard",   label: "Retard livraison",    icon: "⏰", color: "#EF4444" },
  { id: "endommage",label: "Produit endommagé",   icon: "📦", color: "#F97316" },
  { id: "rupture",  label: "Rupture inattendue",  icon: "🚫", color: "#DC2626" },
  { id: "picking",  label: "Erreur picking",      icon: "🖐", color: "#8B5CF6" },
  { id: "saisie",   label: "Mauvaise saisie",     icon: "💻", color: "#6B7280" },
];

const GRAVITE_COLORS = { Élevée: "#EF4444", Moyenne: "#F59E0B", Faible: "#10B981" };
const STATUT_ECART_COLORS = { Ouvert: "#EF4444", "En cours": "#F59E0B", Complété: "#10B981", Planifié: "#3B82F6" };

const INITIAL_ECARTS = [
  { id:1, date:"2026-02-10", type:"Écart inventaire",  responsable:"J. Tremblay", gravite:"Moyenne", action:"Recompter section A",   statut:"Complété",  sku:"SKU-0007", qte_ecart:-12 },
  { id:2, date:"2026-02-12", type:"Retard livraison",  responsable:"M. Dubois",   gravite:"Élevée",  action:"Contact transporteur",  statut:"En cours",  sku:"SKU-0006", qte_ecart:0   },
  { id:3, date:"2026-02-14", type:"Produit endommagé", responsable:"S. Martin",   gravite:"Faible",  action:"Retour fournisseur",    statut:"Ouvert",    sku:"SKU-0030", qte_ecart:-3  },
  { id:4, date:"2026-02-15", type:"Erreur picking",    responsable:"A. Côté",     gravite:"Moyenne", action:"Formation équipe",      statut:"Planifié",  sku:"SKU-0047", qte_ecart:5   },
  { id:5, date:"2026-03-01", type:"Rupture inattendue",responsable:"J. Tremblay", gravite:"Élevée",  action:"Commande urgente",      statut:"En cours",  sku:"SKU-0081", qte_ecart:-89 },
  { id:6, date:"2026-03-05", type:"Mauvaise saisie",   responsable:"M. Dubois",   gravite:"Faible",  action:"Correction système",    statut:"Complété",  sku:"SKU-0098", qte_ecart:8   },
  { id:7, date:"2026-03-10", type:"Écart inventaire",  responsable:"A. Côté",     gravite:"Élevée",  action:"Audit complet zone B",  statut:"Ouvert",    sku:"SKU-0132", qte_ecart:-27 },
  { id:8, date:"2026-03-14", type:"Retard livraison",  responsable:"S. Martin",   gravite:"Moyenne", action:"Relance fournisseur",   statut:"En cours",  sku:"SKU-0149", qte_ecart:0   },
];

// ── Composant mini-pulse animé ─────────────────
function PulseDot({ color }) {
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: color, flexShrink: 0,
      boxShadow: `0 0 0 0 ${color}`,
      animation: "pulse-ring 1.8s ease-out infinite"
    }} />
  );
}

function PageSurveillance() {
  const { t } = useTheme();
  const { addToast } = useData();

  const [tab, setTab]         = useState("direct");
  const [critSearch, setCritSearch] = useState("");
  const [ecarts, setEcarts]   = useState(INITIAL_ECARTS);
  const [search, setSearch]   = useState("");
  const [gravF, setGravF]     = useState([]);
  const [statF, setStatF]     = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]   = useState(null);
  const [form, setForm]       = useState({
    date:"2026-03-16", type:"Écart inventaire", responsable:"",
    gravite:"Moyenne", action:"", statut:"Ouvert", sku:"", qte_ecart:0
  });

  // ── État formulaire Rapport d'écart (slide-over Vue en direct) ──────────
  const [showRapport, setShowRapport] = useState(false);
  const CAUSES_LIST = ["Erreur de réception","Erreur d'expédition","Erreur picking","Mauvaise saisie système","Mauvais emplacement","Vol / perte","Casse / détérioration","Autre"];
  const ZONES_LIST  = ["Zone A — Réception","Zone B — Stockage vrac","Zone C — Picking","Zone D — Expédition","Zone E — Retours","Allée 1","Allée 2","Allée 3","Extérieur"];
  const emptyRapport = {
    // Section 1 — Comptage physique
    date: "2026-03-16", heure: "08:00",
    sku: "", zone: "", qte_systeme: 0, qte_physique: 0,
    // Section 2 — Investigation
    cause: "Erreur de réception", description: "", gravite: "Moyenne",
    // Section 3 — Action corrective
    action: "", responsable: "", echeance: "2026-03-23", statut: "Ouvert",
  };
  const [rapport, setRapport] = useState(emptyRapport);
  const [rapportStep, setRapportStep] = useState(1); // wizard 3 étapes

  // Calcul automatique de l'écart
  const ecartCalc = (rapport.qte_systeme || 0) - (rapport.qte_physique || 0);

  // Soumission du rapport → alimente le registre d'écarts + journal
  const handleRapportSave = () => {
    if (!rapport.sku || !rapport.responsable || !rapport.action) {
      addToast("SKU, responsable et action corrective sont requis", "error"); return;
    }
    const newId = Math.max(...ecarts.map(e => e.id), 0) + 1;
    setEcarts(p => [{
      id: newId,
      date: rapport.date,
      type: "Écart inventaire",
      responsable: rapport.responsable,
      gravite: rapport.gravite,
      action: rapport.action,
      statut: rapport.statut,
      sku: rapport.sku,
      qte_ecart: -ecartCalc,
      cause: rapport.cause,
      zone: rapport.zone,
      description: rapport.description,
    }, ...p]);
    setShowRapport(false);
    setRapport(emptyRapport);
    setRapportStep(1);
    addToast(`Rapport d'écart enregistré — ${rapport.sku} · Écart: ${ecartCalc > 0 ? "-" : "+"}${Math.abs(ecartCalc)} unités`);
  };

  // Lookup quantité système selon SKU sélectionné
  const handleSkuChange = (val) => {
    const found = ITEMS_FULL.find(i => i.sku === val);
    setRapport(p => ({ ...p, sku: val, qte_systeme: found ? found.stock_net : 0 }));
  };

  // Helper champ formulaire rapport
  const RF = ({ label, field, type="text", options=null, onChange=null, hint=null }) => (
    <div>
      <label style={{ fontSize: 11, color: t.textSub, display: "block", marginBottom: 4, fontWeight: 600 }}>{label}</label>
      {hint && <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 5 }}>{hint}</div>}
      {options ? (
        <select value={rapport[field]}
          onChange={e => onChange ? onChange(e.target.value) : setRapport(p => ({ ...p, [field]: e.target.value }))}
          style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10,
            padding: "8px 12px", color: t.text, fontSize: 13, width: "100%", fontFamily: "inherit", outline: "none" }}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input value={rapport[field]}
          onChange={e => onChange ? onChange(e.target.value) : setRapport(p => ({ ...p, [field]: e.target.value }))}
          type={type}
          style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10,
            padding: "8px 12px", color: t.text, fontSize: 13, width: "100%", fontFamily: "inherit", outline: "none" }} />
      )}
    </div>
  );

  // ── Dérivés stock ──────────────────────────
  const ruptures   = ITEMS_FULL.filter(i => i.statut_service === "Rupture");
  const sousSeuil  = ITEMS_FULL.filter(i => i.statut_service === "Sous seuil");
  const conformes  = ITEMS_FULL.filter(i => i.statut_service === "Conforme");
  const couv15     = ITEMS_FULL.filter(i => i.couverture < 15 && i.couverture >= 0);
  const tauxSvc    = +(conformes.length / ITEMS_FULL.length * 100).toFixed(1);

  // Top articles les plus critiques (couverture la plus faible, positifs)
  const topCritiques = [...ITEMS_FULL]
    .filter(i => i.stock_net > 0 && i.couverture < 30)
    .sort((a, b) => a.couverture - b.couverture)
    .slice(0, 8);

  // Alertes actives toutes catégories confondues
  const alertes = [
    ...ruptures.map(i => ({ niveau: "CRITIQUE", icon: "🔴", sku: i.sku, article: i.article, msg: `Rupture de stock — Net: ${i.stock_net}`, color: "#EF4444", couv: i.couverture })),
    ...sousSeuil.map(i => ({ niveau: "ALERTE",  icon: "🟠", sku: i.sku, article: i.article, msg: `Sous seuil — Net: ${i.stock_net} / Seuil: ${i.seuil_min}`, color: "#F59E0B", couv: i.couverture })),
    ...couv15.map(i => ({ niveau: "AVERTISS.", icon: "🟡", sku: i.sku, article: i.article, msg: `Couverture critique — ${i.couverture}j restants`, color: "#EAB308", couv: i.couverture })),
  ].sort((a, b) => a.couv - b.couv).slice(0, 20);

  // ── Dérivés écarts ─────────────────────────
  const ecartsFilt = useMemo(() => {
    let d = ecarts;
    if (search) { const s = search.toLowerCase(); d = d.filter(e => e.type.toLowerCase().includes(s) || e.responsable.toLowerCase().includes(s) || e.sku.toLowerCase().includes(s)); }
    if (gravF.length) d = d.filter(e => gravF.includes(e.gravite));
    if (statF.length) d = d.filter(e => statF.includes(e.statut));
    return [...d].sort((a, b) => b.date.localeCompare(a.date));
  }, [ecarts, search, gravF, statF]);

  const typeData = useMemo(() => {
    const m = {};
    ecarts.forEach(e => { m[e.type] = (m[e.type] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({
      name, value, color: ECART_TYPES.find(x => x.label === name)?.color || t.info
    }));
  }, [ecarts]);

  const graviteData = [
    { name: "Élevée",  value: ecarts.filter(e => e.gravite === "Élevée").length,  color: GRAVITE_COLORS["Élevée"]  },
    { name: "Moyenne", value: ecarts.filter(e => e.gravite === "Moyenne").length, color: GRAVITE_COLORS["Moyenne"] },
    { name: "Faible",  value: ecarts.filter(e => e.gravite === "Faible").length,  color: GRAVITE_COLORS["Faible"]  },
  ];

  // ── CRUD écarts ────────────────────────────
  const handleSave = () => {
    if (!form.responsable || !form.action) { addToast("Responsable et action requis", "error"); return; }
    if (editId !== null) {
      setEcarts(p => p.map(e => e.id === editId ? { ...form, id: editId, qte_ecart: +form.qte_ecart } : e));
      addToast("Écart mis à jour ✓");
    } else {
      setEcarts(p => [{ ...form, id: Math.max(...p.map(e => e.id)) + 1, qte_ecart: +form.qte_ecart }, ...p]);
      addToast("Écart enregistré ✓");
    }
    setShowForm(false); setEditId(null);
    setForm({ date:"2026-03-16", type:"Écart inventaire", responsable:"", gravite:"Moyenne", action:"", statut:"Ouvert", sku:"", qte_ecart:0 });
  };
  const handleEdit = e => { setForm({ ...e }); setEditId(e.id); setShowForm(true); setTab("ecarts"); };
  const handleDel  = id => { setEcarts(p => p.filter(e => e.id !== id)); addToast("Supprimé", "warn"); };

  // ── Field helper ───────────────────────────
  const F = ({ label, field, type="text", options=null }) => (
    <div>
      <label style={{ fontSize: 11, color: t.textSub, display: "block", marginBottom: 4 }}>{label}</label>
      {options ? (
        <select value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
          style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10,
            padding: "7px 12px", color: t.text, fontSize: 13, width: "100%", fontFamily: "inherit" }}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} type={type}
          style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10,
            padding: "7px 12px", color: t.text, fontSize: 13, width: "100%", fontFamily: "inherit", outline: "none" }} />
      )}
    </div>
  );

  return (
    <>
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Style animation pulse ── */}
      <style>{`@keyframes pulse-ring{0%{box-shadow:0 0 0 0 currentColor}70%{box-shadow:0 0 0 6px transparent}100%{box-shadow:0 0 0 0 transparent}}`}</style>

      {/* ── KPI santé stock ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
        {[
          { icon: "✅", label: "Taux de service",   value: tauxSvc+"%",        sub: conformes.length+" conformes",    color: tauxSvc >= 90 ? t.accent : t.warning },
          { icon: "🔴", label: "Ruptures actives",  value: ruptures.length,    sub: "stock net ≤ 0",                  color: t.danger  },
          { icon: "🟠", label: "Sous seuil",        value: sousSeuil.length,   sub: "stock < seuil min",              color: t.warning },
          { icon: "⏱",  label: "Couverture < 15j",  value: couv15.length,      sub: "risque imminent",                color: "#F97316" },
          { icon: "📋", label: "Écarts ouverts",    value: ecarts.filter(e => e.statut === "Ouvert" || e.statut === "En cours").length, sub: "à traiter", color: t.danger },
        ].map(k => (
          <KpiCard key={k.label} icon={k.icon} label={k.label} value={k.value} sub={k.sub} color={k.color} />
        ))}
      </div>

      {/* ── Onglets ── */}
      <div style={{ display: "flex", gap: 2, background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: 4, width: "fit-content" }}>
        {[
          { k: "direct",   l: "📡 Vue en direct"      },
          { k: "critiques",l: "⚡ Articles critiques"  },
          { k: "ecarts",   l: "📋 Écarts d'inventaire" },
          { k: "sante",    l: "🏥 Santé du stock"      },
        ].map(b => (
          <button key={b.k} onClick={() => setTab(b.k)} style={{
            padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600,
            cursor: "pointer", border: "none", transition: "all 0.2s",
            background: tab === b.k ? t.accent : "transparent",
            color: tab === b.k ? "#000" : t.textSub,
          }}>{b.l}</button>
        ))}
      </div>

      {/* ════════════════════════════════════ */}
      {/* TAB : VUE EN DIRECT                 */}
      {/* ════════════════════════════════════ */}
      {tab === "direct" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Bandeau statut global */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 20px", borderRadius: 14,
            background: ruptures.length > 0 ? t.danger+"12" : t.accent+"10",
            border: `2px solid ${ruptures.length > 0 ? t.danger : t.accent}30`,
          }}>
            <PulseDot color={ruptures.length > 0 ? t.danger : t.accent} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: t.text }}>
                {ruptures.length > 0
                  ? `⚠️ ${ruptures.length} rupture${ruptures.length > 1 ? "s" : ""} active${ruptures.length > 1 ? "s" : ""} — intervention requise`
                  : "✅ Aucune rupture de stock détectée"}
              </div>
              <div style={{ fontSize: 12, color: t.textSub, marginTop: 2 }}>
                Surveillance en temps réel · Mis à jour le 16 mars 2026 · {alertes.length} alertes actives
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textAlign: "right" }}>
              <div>Taux de service</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: tauxSvc >= 90 ? t.accent : t.warning }}>{tauxSvc}%</div>
            </div>
            <button onClick={() => { setShowRapport(true); setRapportStep(1); setRapport(emptyRapport); }}
              style={{ padding: "10px 20px", borderRadius: 12, fontWeight: 700, fontSize: 13,
                border: "none", background: t.accent, color: "#000", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, flexShrink: 0, whiteSpace: "nowrap" }}>
              ✏️ Signaler un écart
            </button>
          </div>

          {/* Fil d'alertes */}
          <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 16, overflow: "hidden", boxShadow: t.shadow }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>
                🔔 Alertes actives <span style={{ fontSize: 12, fontWeight: 400, color: t.textSub, marginLeft: 6 }}>({alertes.length} articles)</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[["CRITIQUE", t.danger], ["ALERTE", t.warning], ["AVERTISS.", "#EAB308"]].map(([lbl, c]) => (
                  <span key={lbl} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                    background: c+"20", color: c, border: `1px solid ${c}40` }}>
                    {alertes.filter(a => a.niveau === lbl).length} {lbl}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ maxHeight: 420, overflowY: "auto" }}>
              {alertes.length === 0 ? (
                <div style={{ padding: 32, textAlign: "center", color: t.textMuted, fontSize: 13 }}>
                  ✅ Aucune alerte active — tous les niveaux de stock sont conformes
                </div>
              ) : alertes.map((a, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "11px 20px", borderBottom: `1px solid ${t.cardBorder}15`,
                  transition: "background 0.1s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = t.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <PulseDot color={a.color} />
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20,
                    background: a.color+"20", color: a.color, border: `1px solid ${a.color}40`,
                    flexShrink: 0, minWidth: 76, textAlign: "center" }}>{a.niveau}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.accent, flexShrink: 0, minWidth: 90 }}>{a.sku}</span>
                  <span style={{ fontSize: 12, color: t.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.article}</span>
                  <span style={{ fontSize: 12, color: t.textSub, flexShrink: 0, maxWidth: 280, textAlign: "right" }}>{a.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Graphiques de synthèse */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Distribution couverture */}
            <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: 20, boxShadow: t.shadow }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14 }}>Distribution de couverture (jours)</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { range: "< 0j",    val: ITEMS_FULL.filter(i => i.couverture < 0).length,                      color: "#DC2626" },
                  { range: "0–15j",   val: ITEMS_FULL.filter(i => i.couverture >= 0  && i.couverture < 15).length, color: "#EF4444" },
                  { range: "15–30j",  val: ITEMS_FULL.filter(i => i.couverture >= 15 && i.couverture < 30).length, color: "#F59E0B" },
                  { range: "30–45j",  val: ITEMS_FULL.filter(i => i.couverture >= 30 && i.couverture < 45).length, color: "#3B82F6" },
                  { range: "45–60j",  val: ITEMS_FULL.filter(i => i.couverture >= 45 && i.couverture < 60).length, color: "#10B981" },
                  { range: "> 60j",   val: ITEMS_FULL.filter(i => i.couverture >= 60).length,                     color: "#8B5CF6" },
                ]} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={t.cardBorder} vertical={false} />
                  <XAxis dataKey="range" tick={{ fill: t.text, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: t.text, fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 10, color: t.text, fontSize: 13 }}
                    formatter={v => [`${v} articles`]} />
                  <Bar dataKey="val" radius={[5, 5, 0, 0]}>
                    {[
                      { range: "< 0j",   color: "#DC2626" },
                      { range: "0–15j",  color: "#EF4444" },
                      { range: "15–30j", color: "#F59E0B" },
                      { range: "30–45j", color: "#3B82F6" },
                      { range: "45–60j", color: "#10B981" },
                      { range: "> 60j",  color: "#8B5CF6" },
                    ].map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Statuts en temps réel */}
            <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: 20, boxShadow: t.shadow }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 16 }}>Statuts en temps réel</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Conforme",   val: conformes.length,  color: t.accent,  icon: "✅" },
                  { label: "Sous seuil", val: sousSeuil.length,  color: t.warning, icon: "⚠️" },
                  { label: "Rupture",    val: ruptures.length,   color: t.danger,  icon: "🔴" },
                ].map(s => {
                  const pct = Math.round(s.val / ITEMS_FULL.length * 100);
                  return (
                    <div key={s.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: t.text, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                          {s.icon} {s.label}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.val} <span style={{ fontSize: 11, color: t.textSub, fontWeight: 400 }}>({pct}%)</span></span>
                      </div>
                      <div style={{ height: 10, borderRadius: 5, background: t.cardBorder, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: pct + "%", background: s.color, borderRadius: 5, transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ marginTop: 4, padding: "10px 14px", background: t.bg, borderRadius: 10, border: `1px solid ${t.cardBorder}` }}>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 2 }}>Net = Physique + Transit − Réservé</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.accent }}>Formule BNMP appliquée sur {ITEMS_FULL.length} SKU ✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════ */}
      {/* TAB : ARTICLES CRITIQUES            */}
      {/* ════════════════════════════════════ */}
      {tab === "critiques" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
              {[
                { icon: "🔴", label: "Ruptures",       value: ITEMS_FULL.filter(i => i.statut_service === "Rupture").length,   sub: "stock ≤ 0",        color: t.danger  },
                { icon: "🟠", label: "Sous seuil",     value: ITEMS_FULL.filter(i => i.statut_service === "Sous seuil").length, sub: "stock < seuil min", color: t.warning },
                { icon: "⚡", label: "Total critiques", value: ITEMS_FULL.filter(i => i.priorite === "Haute" || i.statut_service !== "Conforme").length, sub: "priorité haute", color: t.danger },
                { icon: "⏱", label: "Couv. < 15j",     value: ITEMS_FULL.filter(i => i.couverture < 15).length,                sub: "risque imminent",   color: "#F97316" },
              ].map(k => (
                <KpiCard key={k.label} icon={k.icon} label={k.label} value={k.value} sub={k.sub} color={k.color} />
              ))}
            </div>

            {/* Barre recherche + export */}
            <div style={{ display: "flex", gap: 10, alignItems: "center",
              background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: "10px 14px" }}>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: t.textMuted }}>🔍</span>
                <input value={critSearch} onChange={e => setCritSearch(e.target.value)}
                  placeholder="SKU ou article…"
                  style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10,
                    padding: "7px 12px 7px 32px", color: t.text, fontSize: 13, outline: "none", width: 220, fontFamily: "inherit" }} />
              </div>
              <span style={{ fontSize: 12, color: t.textSub }}>{(critSearch ? ITEMS_FULL.filter(i=>(i.priorite==="Haute"||i.statut_service!=="Conforme")&&(i.sku.toLowerCase().includes(critSearch.toLowerCase())||i.article.toLowerCase().includes(critSearch.toLowerCase()))) : ITEMS_FULL.filter(i=>i.priorite==="Haute"||i.statut_service!=="Conforme")).length} article(s)</span>
              <div style={{ marginLeft: "auto" }}>
                <button onClick={() => {
                  const rows2 = ITEMS_FULL.filter(i=>i.priorite==="Haute"||i.statut_service!=="Conforme").filter(i=>critSearch?(i.sku.toLowerCase().includes(critSearch.toLowerCase())||i.article.toLowerCase().includes(critSearch.toLowerCase())):true);
                  const cols = ["sku","article","abc","stock_net","seuil_min","couverture","eoq","statut_service"];
                  const csv = ["\uFEFFSKU;Article;ABC;Stock Net;Seuil;Couverture;EOQ;Statut",...rows2.map(r=>cols.map(c=>r[c]??"").join(";"))].join("\n");
                  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"})); a.download="critiques.csv"; a.click();
                }} style={{ padding: "6px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                  border: `1px solid ${t.accent}`, background: t.accent+"15", color: t.accent, cursor: "pointer" }}>↓ CSV</button>
              </div>
            </div>

            {/* Table */}
            <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 16, overflow: "hidden", boxShadow: t.shadow }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: t.bg }}>
                      {["SKU","Article","ABC","Stock Net","Seuil","Couv.(j)","EOQ","Statut","Priorité",""].map(h => (
                        <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 10, fontWeight: 700,
                          textTransform: "uppercase", letterSpacing: "0.07em", color: t.textMuted,
                          borderBottom: `2px solid ${t.cardBorder}`, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...ITEMS_FULL.filter(i => i.priorite === "Haute" || i.statut_service !== "Conforme").filter(i => critSearch ? (i.sku.toLowerCase().includes(critSearch.toLowerCase()) || i.article.toLowerCase().includes(critSearch.toLowerCase())) : true)].sort((a,b) => ({Rupture:1,"Sous seuil":2,Conforme:3}[a.statut_service]||9) - ({Rupture:1,"Sous seuil":2,Conforme:3}[b.statut_service]||9)).map(item => (
                      <tr key={item.id} onClick={() => setSlideOver({ type: "item", data: item })}
                        style={{ borderBottom: `1px solid ${t.cardBorder}15`, cursor: "pointer",
                          background: item.statut_service === "Rupture" ? t.danger+"06" : "transparent" }}
                        onMouseEnter={e => e.currentTarget.style.background = t.bg}
                        onMouseLeave={e => e.currentTarget.style.background = item.statut_service === "Rupture" ? t.danger+"06" : "transparent"}>
                        <td style={{ padding: "9px 14px", fontSize: 12, color: t.accent, fontWeight: 700 }}>{item.sku}</td>
                        <td style={{ padding: "9px 14px", fontSize: 12, color: t.text, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.article}</td>
                        <td style={{ padding: "9px 14px" }}>
                          <span style={{ display:"inline-block",borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 8px",
                            backgroundColor:ABC_COLORS[item.abc]+"20",color:ABC_COLORS[item.abc],border:`1px solid ${ABC_COLORS[item.abc]}40`}}>{item.abc}</span>
                        </td>
                        <td style={{ padding: "9px 14px", fontSize: 12, fontWeight: 700, textAlign: "right",
                          color: item.stock_net <= 0 ? t.danger : item.stock_net < item.seuil_min ? t.warning : t.text }}>{item.stock_net}</td>
                        <td style={{ padding: "9px 14px", fontSize: 12, color: t.textSub, textAlign: "right" }}>{item.seuil_min}</td>
                        <td style={{ padding: "9px 14px", fontSize: 12, fontWeight: 600, textAlign: "right",
                          color: item.couverture < 15 ? t.danger : t.warning }}>{item.couverture}j</td>
                        <td style={{ padding: "9px 14px", fontSize: 12, color: t.info, textAlign: "right", fontWeight: 700 }}>{item.eoq}</td>
                        <td style={{ padding: "9px 14px" }}>
                          <span style={{ display:"inline-block",borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 9px",
                            backgroundColor:STATUS_COLORS[item.statut_service]+"20",color:STATUS_COLORS[item.statut_service],
                            border:`1px solid ${STATUS_COLORS[item.statut_service]}40`}}>{item.statut_service}</span>
                        </td>
                        <td style={{ padding: "9px 14px" }}>
                          <span style={{ display:"inline-block",borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 9px",
                            backgroundColor:PRIO_COLORS[item.priorite]+"20",color:PRIO_COLORS[item.priorite],
                            border:`1px solid ${PRIO_COLORS[item.priorite]}40`}}>{item.priorite}</span>
                        </td>
                        <td style={{ padding: "9px 14px" }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => createPO(item)}
                            style={{ padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                              border: `1px solid ${t.accent}`, background: t.accent+"18",
                              color: t.accent, cursor: "pointer", whiteSpace: "nowrap" }}>
                            + Créer PO
                          </button>
                        </td>
                      </tr>
                    ))}
                    {ITEMS_FULL.filter(i => (i.priorite === "Haute" || i.statut_service !== "Conforme") && (critSearch ? (i.sku.toLowerCase().includes(critSearch.toLowerCase()) || i.article.toLowerCase().includes(critSearch.toLowerCase())) : true)).length === 0 && (
                      <tr><td colSpan={10} style={{ padding: 32, textAlign: "center", color: t.textMuted, fontSize: 13 }}>
                        ✅ Aucun article critique trouvé
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      )}

      {/* ════════════════════════════════════ */}
      {/* TAB : ÉCARTS D'INVENTAIRE           */}
      {/* ════════════════════════════════════ */}
      {tab === "ecarts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Barre d'outils */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
            background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 14, padding: "12px 16px" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: t.textMuted }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Type, responsable, SKU…"
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10,
                  padding: "7px 12px 7px 32px", color: t.text, fontSize: 13, outline: "none", width: 210, fontFamily: "inherit" }} />
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {["Élevée","Moyenne","Faible"].map(g => (
                <button key={g} onClick={() => setGravF(p => p.includes(g) ? p.filter(x=>x!==g) : [...p,g])} style={{
                  padding: "4px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
                  border: `1px solid ${gravF.includes(g) ? GRAVITE_COLORS[g] : t.cardBorder}`,
                  background: gravF.includes(g) ? GRAVITE_COLORS[g]+"22" : "transparent",
                  color: gravF.includes(g) ? GRAVITE_COLORS[g] : t.textSub,
                }}>{g}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 5 }}>
              {["Ouvert","En cours","Planifié","Complété"].map(s => (
                <button key={s} onClick={() => setStatF(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s])} style={{
                  padding: "4px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
                  border: `1px solid ${statF.includes(s) ? STATUT_ECART_COLORS[s] : t.cardBorder}`,
                  background: statF.includes(s) ? STATUT_ECART_COLORS[s]+"22" : "transparent",
                  color: statF.includes(s) ? STATUT_ECART_COLORS[s] : t.textSub,
                }}>{s}</button>
              ))}
            </div>
            <span style={{ fontSize: 12, color: t.textSub }}>{ecartsFilt.length} écart{ecartsFilt.length > 1 ? "s" : ""}</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button onClick={() => {
                const cols = ["date","type","responsable","gravite","action","statut","sku","qte_ecart"];
                const csv = ["\uFEFFDate;Type;Responsable;Gravité;Action;Statut;SKU;Écart Qté",
                  ...ecartsFilt.map(r => cols.map(c => r[c] ?? "").join(";"))].join("\n");
                const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"})); a.download="ecarts.csv"; a.click();
              }} style={{ padding: "6px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                border: `1px solid ${t.accent}`, background: t.accent+"15", color: t.accent, cursor: "pointer" }}>↓ CSV</button>
              <button onClick={() => { setEditId(null); setForm({ date:"2026-03-16",type:"Écart inventaire",responsable:"",gravite:"Moyenne",action:"",statut:"Ouvert",sku:"",qte_ecart:0 }); setShowForm(s=>!s); }}
                style={{ padding: "6px 16px", borderRadius: 9, fontSize: 12, fontWeight: 700,
                  border: "none", background: t.accent, color: "#000", cursor: "pointer" }}>
                + Nouvel écart
              </button>
            </div>
          </div>

          {/* Formulaire */}
          {showForm && (
            <div style={{ background: t.card, border: `1px solid ${t.accent}40`, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 16 }}>
                {editId !== null ? "✏️ Modifier l'écart" : "➕ Enregistrer un nouvel écart"}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
                <F label="Date"             field="date"        type="date" />
                <F label="Type d'écart"     field="type"        options={ECART_TYPES.map(a=>a.label)} />
                <F label="SKU concerné"     field="sku" />
                <F label="Responsable"      field="responsable" />
                <F label="Gravité"          field="gravite"     options={["Élevée","Moyenne","Faible"]} />
                <F label="Écart quantité"   field="qte_ecart"   type="number" />
                <F label="Action corrective"field="action" />
                <F label="Statut"           field="statut"      options={["Ouvert","En cours","Planifié","Complété"]} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button onClick={handleSave} style={{ padding: "8px 22px", borderRadius: 10, fontWeight: 700, fontSize: 13,
                  border: "none", background: t.accent, color: "#000", cursor: "pointer" }}>
                  {editId !== null ? "Mettre à jour" : "Enregistrer"}
                </button>
                <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ padding: "8px 18px", borderRadius: 10,
                  fontWeight: 600, fontSize: 13, border: `1px solid ${t.cardBorder}`, background: "transparent", color: t.textSub, cursor: "pointer" }}>
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Table registre */}
          <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 16, overflow: "hidden", boxShadow: t.shadow }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: t.bg }}>
                    {["Date","Type","SKU","Responsable","Gravité","Écart Qté","Action corrective","Statut",""].map(h => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 10, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.07em", color: t.textMuted,
                        borderBottom: `2px solid ${t.cardBorder}`, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ecartsFilt.map(e => (
                    <tr key={e.id} style={{ borderBottom: `1px solid ${t.cardBorder}15`,
                      background: e.gravite === "Élevée" && e.statut === "Ouvert" ? t.danger+"06" : "transparent" }}
                      onMouseEnter={ev => ev.currentTarget.style.background = t.bg}
                      onMouseLeave={ev => ev.currentTarget.style.background = e.gravite==="Élevée"&&e.statut==="Ouvert" ? t.danger+"06" : "transparent"}>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: t.textSub, whiteSpace: "nowrap" }}>{e.date}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, color: t.text }}>
                        <span style={{ marginRight: 6 }}>{ECART_TYPES.find(x=>x.label===e.type)?.icon||"⚠️"}</span>{e.type}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 11, color: t.accent, fontWeight: 700 }}>{e.sku||"—"}</td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: t.text }}>{e.responsable}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ display:"inline-block",borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 10px",
                          backgroundColor:GRAVITE_COLORS[e.gravite]+"20",color:GRAVITE_COLORS[e.gravite],border:`1px solid ${GRAVITE_COLORS[e.gravite]}40`}}>{e.gravite}</span>
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, textAlign: "right",
                        color: e.qte_ecart < 0 ? t.danger : e.qte_ecart > 0 ? t.warning : t.textMuted }}>
                        {e.qte_ecart !== 0 ? (e.qte_ecart > 0 ? "+" : "") + e.qte_ecart : "—"}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 12, color: t.textSub, maxWidth: 200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.action}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ display:"inline-block",borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 10px",
                          backgroundColor:STATUT_ECART_COLORS[e.statut]+"20",color:STATUT_ECART_COLORS[e.statut],border:`1px solid ${STATUT_ECART_COLORS[e.statut]}40`}}>{e.statut}</span>
                      </td>
                      <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                        <button onClick={() => handleEdit(e)} style={{ padding:"3px 10px",borderRadius:7,fontSize:11,fontWeight:600,
                          border:`1px solid ${t.info}40`,background:t.info+"12",color:t.info,cursor:"pointer",marginRight:6 }}>✏️</button>
                        <button onClick={() => handleDel(e.id)} style={{ padding:"3px 10px",borderRadius:7,fontSize:11,fontWeight:600,
                          border:`1px solid ${t.danger}40`,background:t.danger+"12",color:t.danger,cursor:"pointer" }}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {ecartsFilt.length === 0 && (
                    <tr><td colSpan={9} style={{ padding:32,textAlign:"center",color:t.textMuted,fontSize:13 }}>Aucun écart trouvé</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Graphiques inline */}
            <div style={{ padding: 20, borderTop: `1px solid ${t.cardBorder}`, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Donut par type */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 12 }}>Répartition par type</div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <ResponsiveContainer width="50%" height={140}>
                    <PieChart margin={{ top:0,right:0,bottom:0,left:0 }}>
                      <Pie data={typeData} cx="50%" cy="50%" innerRadius={42} outerRadius={64} dataKey="value" paddingAngle={3}>
                        {typeData.map((e,i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:10,color:t.text,fontSize:12 }}
                        formatter={(val,name) => [`${val}`,name]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                    {typeData.map(e => (
                      <div key={e.name} style={{ display:"flex",alignItems:"center",gap:8 }}>
                        <div style={{ width:10,height:10,borderRadius:2,background:e.color,flexShrink:0 }} />
                        <span style={{ fontSize:11,color:t.text,flex:1 }}>{e.name}</span>
                        <span style={{ fontSize:12,fontWeight:800,color:e.color }}>{e.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Barres gravité */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 12 }}>Gravité des écarts</div>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={graviteData} layout="vertical" margin={{ top:0,right:8,left:0,bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.cardBorder} horizontal={false} />
                    <XAxis type="number" tick={{ fill:t.text,fontSize:11 }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" tick={{ fill:t.text,fontSize:12,fontWeight:600 }} width={65} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:10,color:t.text,fontSize:12 }} />
                    <Bar dataKey="value" radius={[0,5,5,0]}>
                      {graviteData.map((e,i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════ */}
      {/* TAB : SANTÉ DU STOCK                */}
      {/* ════════════════════════════════════ */}
      {tab === "sante" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Top articles à risque */}
          <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 16, overflow: "hidden", boxShadow: t.shadow }}>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.cardBorder}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>⏱ Articles à couverture critique (&lt; 30 jours)</div>
              <div style={{ fontSize: 11, color: t.textSub, marginTop: 2 }}>Classés du plus urgent au moins urgent · Stock positif uniquement</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: t.bg }}>
                    {["SKU","Article","Famille","ABC","Stock net","Seuil min","Couverture","Statut","EOQ à commander"].map(h => (
                      <th key={h} style={{ padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,
                        textTransform:"uppercase",letterSpacing:"0.07em",color:t.textMuted,
                        borderBottom:`2px solid ${t.cardBorder}`,whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topCritiques.map(item => (
                    <tr key={item.id} style={{ borderBottom:`1px solid ${t.cardBorder}15` }}
                      onMouseEnter={e => e.currentTarget.style.background = t.bg}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding:"9px 14px",fontSize:12,color:t.accent,fontWeight:700 }}>{item.sku}</td>
                      <td style={{ padding:"9px 14px",fontSize:12,color:t.text,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{item.article}</td>
                      <td style={{ padding:"9px 14px",fontSize:11,color:t.textSub }}>{item.famille}</td>
                      <td style={{ padding:"9px 14px" }}>
                        <span style={{ display:"inline-block",borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 7px",
                          backgroundColor:ABC_COLORS[item.abc]+"20",color:ABC_COLORS[item.abc],border:`1px solid ${ABC_COLORS[item.abc]}40` }}>{item.abc}</span>
                      </td>
                      <td style={{ padding:"9px 14px",fontSize:12,fontWeight:700,color:item.stock_net<item.seuil_min?t.warning:t.text,textAlign:"right" }}>{item.stock_net}</td>
                      <td style={{ padding:"9px 14px",fontSize:12,color:t.textSub,textAlign:"right" }}>{item.seuil_min}</td>
                      <td style={{ padding:"9px 14px" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                          <div style={{ flex:1,height:8,borderRadius:4,background:t.cardBorder,overflow:"hidden",minWidth:60 }}>
                            <div style={{ height:"100%",width:Math.min(100,item.couverture/30*100)+"%",
                              background:item.couverture<15?t.danger:item.couverture<25?t.warning:"#EAB308",borderRadius:4 }} />
                          </div>
                          <span style={{ fontSize:12,fontWeight:800,minWidth:34,
                            color:item.couverture<15?t.danger:item.couverture<25?t.warning:"#EAB308" }}>{item.couverture}j</span>
                        </div>
                      </td>
                      <td style={{ padding:"9px 14px" }}>
                        <span style={{ display:"inline-block",borderRadius:20,fontSize:10,fontWeight:700,padding:"2px 9px",
                          backgroundColor:STATUS_COLORS[item.statut_service]+"20",color:STATUS_COLORS[item.statut_service],
                          border:`1px solid ${STATUS_COLORS[item.statut_service]}40` }}>{item.statut_service}</span>
                      </td>
                      <td style={{ padding:"9px 14px",fontSize:12,fontWeight:800,color:t.info,textAlign:"right" }}>{item.eoq} unités</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Valeur immobilisée par famille */}
          <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 16, padding: 20, boxShadow: t.shadow }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 14 }}>
              💰 Valeur stock immobilisée par famille
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={(() => {
                  const m = {};
                  ITEMS_FULL.forEach(i => { m[i.famille] = (m[i.famille]||0) + i.stock_net * i.cout_unit; });
                  return Object.entries(m).map(([name,val])=>({ name, val: Math.round(val/1000) })).sort((a,b)=>b.val-a.val);
                })()}
                layout="vertical"
                margin={{ top:4,right:16,left:4,bottom:4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={t.cardBorder} horizontal={false} />
                <XAxis type="number" tick={{ fill:t.text,fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill:t.text,fontSize:12,fontWeight:500 }} width={105} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:t.card,border:`1px solid ${t.cardBorder}`,borderRadius:10,color:t.text,fontSize:13 }}
                  formatter={v => [v.toLocaleString()+" k$ CA","Valeur stock"]} />
                <Bar dataKey="val" radius={[0,6,6,0]}>
                  {["#10B981","#3B82F6","#8B5CF6","#F59E0B","#06B6D4","#EC4899","#F97316","#6B7280"].map((c,i)=><Cell key={i} fill={c}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>

    {/* ════════════════════════════════════════════ */}
    {/* SLIDE-OVER : RAPPORT D'ÉCART D'INVENTAIRE   */}
    {/* ════════════════════════════════════════════ */}
    {showRapport && (
      <>
        {/* Overlay */}
        <div onClick={() => { setShowRapport(false); setRapportStep(1); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 8000 }} />

        {/* Panneau */}
        <div style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 500,
          background: t.surface, borderLeft: `1px solid ${t.cardBorder}`,
          zIndex: 8001, overflowY: "auto", display: "flex", flexDirection: "column",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.35)"
        }}>
          {/* En-tête */}
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${t.cardBorder}`,
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: t.text }}>✏️ Rapport d'écart d'inventaire</div>
              <div style={{ fontSize: 11, color: t.textSub, marginTop: 3 }}>
                Réservé au superviseur / responsable · 16 mars 2026
              </div>
            </div>
            <button onClick={() => { setShowRapport(false); setRapportStep(1); }}
              style={{ background: "none", border: "none", color: t.textSub, cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
          </div>

          {/* Stepper */}
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${t.cardBorder}`,
            display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {[
              { n: 1, label: "Comptage physique" },
              { n: 2, label: "Investigation"     },
              { n: 3, label: "Action corrective" },
            ].map((step, i, arr) => (
              <div key={step.n} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div onClick={() => rapportStep > step.n && setRapportStep(step.n)}
                    style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800,
                      background: rapportStep === step.n ? t.accent
                                : rapportStep > step.n  ? t.accent+"40" : t.cardBorder,
                      color: rapportStep === step.n ? "#000"
                           : rapportStep > step.n  ? t.accent : t.textMuted,
                      cursor: rapportStep > step.n ? "pointer" : "default",
                      transition: "all 0.2s",
                    }}>
                    {rapportStep > step.n ? "✓" : step.n}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600,
                    color: rapportStep === step.n ? t.text : t.textMuted,
                    whiteSpace: "nowrap" }}>{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ flex: 1, height: 2, borderRadius: 1,
                    background: rapportStep > step.n ? t.accent+"60" : t.cardBorder, minWidth: 16 }} />
                )}
              </div>
            ))}
          </div>

          {/* Corps */}
          <div style={{ flex: 1, padding: "24px 24px 16px", display: "flex", flexDirection: "column", gap: 18 }}>

            {/* ── ÉTAPE 1 : Comptage physique ── */}
            {rapportStep === 1 && (
              <>
                <div style={{ padding: "12px 16px", background: t.info+"10",
                  border: `1px solid ${t.info}30`, borderRadius: 12, fontSize: 12, color: t.textSub, lineHeight: 1.5 }}>
                  📦 Sélectionnez l'article, indiquez la zone et les quantités constatées.
                  L'écart sera calculé automatiquement.
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <RF label="Date du constat" field="date" type="date" />
                  <RF label="Heure" field="heure" type="time" />
                </div>

                <div>
                  <label style={{ fontSize: 11, color: t.textSub, display: "block", marginBottom: 4, fontWeight: 600 }}>SKU de l'article</label>
                  <select value={rapport.sku} onChange={e => handleSkuChange(e.target.value)}
                    style={{ background: t.inputBg, border: `1px solid ${rapport.sku ? t.accent : t.inputBorder}`,
                      borderRadius: 10, padding: "8px 12px",
                      color: rapport.sku ? t.text : t.textMuted,
                      fontSize: 13, width: "100%", fontFamily: "inherit", outline: "none" }}>
                    <option value="">— Sélectionner un SKU —</option>
                    {ITEMS_FULL.map(i => (
                      <option key={i.sku} value={i.sku}>{i.sku} — {i.article}</option>
                    ))}
                  </select>
                </div>

                <RF label="Zone / Emplacement" field="zone"
                  options={["— Sélectionner une zone —", ...ZONES_LIST]} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: t.textSub, display: "block", marginBottom: 4, fontWeight: 600 }}>
                      Qté système <span style={{ color: t.textMuted, fontWeight: 400 }}>(auto)</span>
                    </label>
                    <div style={{ padding: "8px 12px", borderRadius: 10, fontSize: 14, fontWeight: 800,
                      background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.info }}>
                      {rapport.qte_systeme}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: t.textSub, display: "block", marginBottom: 4, fontWeight: 600 }}>Qté comptée physiquement</label>
                    <input type="number" value={rapport.qte_physique}
                      onChange={e => setRapport(p => ({ ...p, qte_physique: +e.target.value }))}
                      style={{ background: t.inputBg, border: `2px solid ${t.accent}`, borderRadius: 10,
                        padding: "8px 12px", color: t.text, fontSize: 14, fontWeight: 700,
                        width: "100%", fontFamily: "inherit", outline: "none" }} />
                  </div>
                </div>

                {/* Résultat écart */}
                <div style={{
                  padding: "14px 18px", borderRadius: 12, textAlign: "center",
                  background: ecartCalc === 0 ? t.accent+"12" : ecartCalc > 0 ? t.danger+"12" : t.warning+"12",
                  border: `2px solid ${ecartCalc === 0 ? t.accent : ecartCalc > 0 ? t.danger : t.warning}40`,
                }}>
                  <div style={{ fontSize: 11, color: t.textSub, marginBottom: 4 }}>Écart calculé (Système − Physique)</div>
                  <div style={{ fontSize: 32, fontWeight: 900,
                    color: ecartCalc === 0 ? t.accent : ecartCalc > 0 ? t.danger : t.warning }}>
                    {ecartCalc > 0 ? "−" : ecartCalc < 0 ? "+" : ""}{Math.abs(ecartCalc)} unités
                  </div>
                  <div style={{ fontSize: 11, color: t.textSub, marginTop: 4 }}>
                    {ecartCalc === 0 ? "✅ Aucun écart — stock conforme"
                     : ecartCalc > 0 ? "⬇️ Manquant — moins d'unités que prévu"
                     : "⬆️ Surplus — plus d'unités que prévu"}
                  </div>
                </div>
              </>
            )}

            {/* ── ÉTAPE 2 : Investigation / cause racine ── */}
            {rapportStep === 2 && (
              <>
                <div style={{ padding: "12px 16px", background: t.purple+"10",
                  border: `1px solid ${t.purple}30`, borderRadius: 12,
                  fontSize: 12, color: t.textSub, lineHeight: 1.5 }}>
                  🔍 Identifiez la cause racine et évaluez la gravité pour prioriser les actions.
                </div>

                <div>
                  <label style={{ fontSize: 11, color: t.textSub, display: "block", marginBottom: 8, fontWeight: 600 }}>Cause identifiée</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {CAUSES_LIST.map(cause => (
                      <button key={cause} onClick={() => setRapport(p => ({ ...p, cause }))}
                        style={{
                          padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                          cursor: "pointer", textAlign: "left",
                          border: `2px solid ${rapport.cause === cause ? t.accent : t.cardBorder}`,
                          background: rapport.cause === cause ? t.accent+"18" : t.inputBg,
                          color: rapport.cause === cause ? t.accent : t.textSub,
                          transition: "all 0.15s",
                        }}>{cause}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, color: t.textSub, display: "block", marginBottom: 4, fontWeight: 600 }}>
                    Description détaillée <span style={{ fontWeight: 400 }}>(optionnel)</span>
                  </label>
                  <textarea value={rapport.description}
                    onChange={e => setRapport(p => ({ ...p, description: e.target.value }))}
                    placeholder="Circonstances, observations, contexte…"
                    rows={4}
                    style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10,
                      padding: "8px 12px", color: t.text, fontSize: 13, width: "100%",
                      fontFamily: "inherit", outline: "none", resize: "vertical", lineHeight: 1.5 }} />
                </div>

                <div>
                  <label style={{ fontSize: 11, color: t.textSub, display: "block", marginBottom: 8, fontWeight: 600 }}>Niveau de gravité</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[
                      { val: "Élevée",  desc: "Impact majeur sur les opérations",  color: GRAVITE_COLORS["Élevée"]  },
                      { val: "Moyenne", desc: "Impact modéré, traiter sous 48h",    color: GRAVITE_COLORS["Moyenne"] },
                      { val: "Faible",  desc: "Impact mineur, peut attendre",       color: GRAVITE_COLORS["Faible"]  },
                    ].map(g => (
                      <button key={g.val} onClick={() => setRapport(p => ({ ...p, gravite: g.val }))}
                        style={{
                          flex: 1, padding: "10px 8px", borderRadius: 12, cursor: "pointer",
                          border: `2px solid ${rapport.gravite === g.val ? g.color : t.cardBorder}`,
                          background: rapport.gravite === g.val ? g.color+"18" : t.inputBg,
                          transition: "all 0.15s", textAlign: "center"
                        }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: rapport.gravite === g.val ? g.color : t.textSub }}>{g.val}</div>
                        <div style={{ fontSize: 10, color: t.textMuted, marginTop: 3, lineHeight: 1.3 }}>{g.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── ÉTAPE 3 : Action corrective ── */}
            {rapportStep === 3 && (
              <>
                <div style={{ padding: "12px 16px", background: t.accent+"10",
                  border: `1px solid ${t.accent}30`, borderRadius: 12,
                  fontSize: 12, color: t.textSub, lineHeight: 1.5 }}>
                  ✅ Planifiez l'action corrective, assignez un responsable et fixez une échéance.
                </div>

                {/* Récapitulatif */}
                <div style={{ padding: "14px 16px", background: t.bg,
                  border: `1px solid ${t.cardBorder}`, borderRadius: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: t.textMuted, marginBottom: 10,
                    textTransform: "uppercase", letterSpacing: "0.06em" }}>Récapitulatif</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px" }}>
                    {[
                      { l: "Article",  v: rapport.sku || "—"                },
                      { l: "Zone",     v: rapport.zone || "—"               },
                      { l: "Écart",    v: `${ecartCalc > 0 ? "−" : ecartCalc < 0 ? "+" : ""}${Math.abs(ecartCalc)} unités` },
                      { l: "Cause",    v: rapport.cause                     },
                      { l: "Gravité",  v: rapport.gravite                   },
                      { l: "Date",     v: rapport.date + " " + rapport.heure},
                    ].map(r => (
                      <div key={r.l} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${t.cardBorder}20`, paddingBottom: 4 }}>
                        <span style={{ fontSize: 11, color: t.textSub }}>{r.l}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: t.text }}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 11, color: t.textSub, display: "block", marginBottom: 4, fontWeight: 600 }}>Action corrective planifiée</label>
                  <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 6 }}>Ex : Recompter la zone, corriger la saisie, contacter le fournisseur…</div>
                  <textarea value={rapport.action}
                    onChange={e => setRapport(p => ({ ...p, action: e.target.value }))}
                    placeholder="Décrivez l'action à mettre en place…"
                    rows={3}
                    style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: 10,
                      padding: "8px 12px", color: t.text, fontSize: 13, width: "100%",
                      fontFamily: "inherit", outline: "none", resize: "vertical", lineHeight: 1.5 }} />
                </div>

                <RF label="Responsable assigné" field="responsable"
                  options={["— Sélectionner —","J. Tremblay","M. Dubois","S. Martin","A. Côté","Équipe terrain"]} />

                <RF label="Échéance" field="echeance" type="date" />

                <div>
                  <label style={{ fontSize: 11, color: t.textSub, display: "block", marginBottom: 8, fontWeight: 600 }}>Statut initial</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["Ouvert","En cours","Planifié"].map(s => (
                      <button key={s} onClick={() => setRapport(p => ({ ...p, statut: s }))}
                        style={{
                          flex: 1, padding: "8px 12px", borderRadius: 10, cursor: "pointer",
                          border: `2px solid ${rapport.statut === s ? STATUT_ECART_COLORS[s] : t.cardBorder}`,
                          background: rapport.statut === s ? STATUT_ECART_COLORS[s]+"18" : t.inputBg,
                          color: rapport.statut === s ? STATUT_ECART_COLORS[s] : t.textSub,
                          fontSize: 12, fontWeight: 700, transition: "all 0.15s",
                        }}>{s}</button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Pied navigation */}
          <div style={{ padding: "16px 24px", borderTop: `1px solid ${t.cardBorder}`,
            display: "flex", gap: 10, justifyContent: "space-between", flexShrink: 0,
            background: t.surface }}>
            <button onClick={() => { setShowRapport(false); setRapportStep(1); }}
              style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                border: `1px solid ${t.cardBorder}`, background: "transparent", color: t.textSub, cursor: "pointer" }}>
              Annuler
            </button>
            <div style={{ display: "flex", gap: 10 }}>
              {rapportStep > 1 && (
                <button onClick={() => setRapportStep(s => s - 1)}
                  style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    border: `1px solid ${t.cardBorder}`, background: "transparent", color: t.textSub, cursor: "pointer" }}>
                  ← Retour
                </button>
              )}
              {rapportStep < 3 ? (
                <button onClick={() => {
                    if (rapportStep === 1 && !rapport.sku) { addToast("Veuillez sélectionner un SKU", "error"); return; }
                    setRapportStep(s => s + 1);
                  }}
                  style={{ padding: "9px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                    border: "none", background: t.accent, color: "#000", cursor: "pointer" }}>
                  Suivant →
                </button>
              ) : (
                <button onClick={handleRapportSave}
                  style={{ padding: "9px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                    border: "none", background: t.accent, color: "#000", cursor: "pointer" }}>
                  ✅ Soumettre le rapport
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
}


// ─────────────────────────────────────────────
// 17. NAVIGATION CONFIG
// ─────────────────────────────────────────────
const NAV=[
  {id:"dashboard",icon:"⊞", label:"Dashboard"},
  {id:"stock",    icon:"✏️",label:"Stock éditable"},
  {id:"surveillance",icon:"📡",label:"Surveillance & Alertes",badge:"surv"},
  {id:"inventory",icon:"📦",label:"Inventaire CRUD"},
  {id:"processus",icon:"🔄",label:"Processus UML"},
  {id:"kpi",      icon:"📊",label:"KPI & TRS"},
  {id:"abceoq",   icon:"📐",label:"ABC/EOQ"},
  {id:"suppliers",icon:"🏭",label:"Fournisseurs"},
  {id:"orders",   icon:"🛒",label:"Purchase Orders",badge:"po"},
  {id:"audit",    icon:"📋",label:"Journal Audit",badge:"audit"},
  {id:"rules",    icon:"⚙️",label:"Règles / UAT"},
];

const PAGE_INFO={
  dashboard: {title:"Dashboard",          sub:"Vue globale supply chain"},
  stock:     {title:"Stock éditable",     sub:"Cliquez sur une cellule pour modifier · Net recalculé automatiquement"},
  surveillance:{title:"Surveillance & Alertes", sub:"Vue en direct · Articles critiques · Écarts d'inventaire · Santé du stock"},
  inventory: {title:"Inventaire",         sub:"CRUD Articles — Net = Physique + Transit − Réservé"},
  processus: {title:"Processus UML",      sub:"AS-IS / TO-BE — Swimlanes Magasinier / Système / Acheteur"},
  kpi:       {title:"KPI & TRS",          sub:"Taux de service · TRS = Dispo × Perf × Qualité"},
  abceoq:    {title:"ABC / EOQ",          sub:"Segmentation · EOQ = √(2DS/H) · Pareto · XYZ"},
  suppliers: {title:"Fournisseurs",       sub:"Scoring · conformité · délais"},
  orders:    {title:"Purchase Orders",    sub:"Workflow Brouillon → Validé → Envoyé → Reçu → Clos"},
  audit:     {title:"Journal d'audit",    sub:"Traçabilité complète · Garde-fous · Événements"},
  rules:     {title:"Règles & UAT",       sub:"Formules BNMP · IF/THEN · Scénarios de test"},
};

// ─────────────────────────────────────────────
// 18. APP ROOT
// ─────────────────────────────────────────────
export default function App(){
  const[theme,setTheme]=useState("dark");
  const t=THEMES[theme];

  const[activePage,setActivePage]=useState("dashboard");
  const[pos,setPos]=useState(INITIAL_POS);
  const[tasks,setTasks]=useState(INITIAL_TASKS);
  const[events,setEvents]=useState(INITIAL_EVENTS);
  const[statusHistory,setStatusHistory]=useState([]);
  const[slideOver,setSlideOver]=useState(null);
  const[toasts,setToasts]=useState([]);
  const[sidebarCollapsed,setSidebarCollapsed]=useState(false);
  const[globalSearch,setGlobalSearch]=useState(false);
  const[showNotifs,setShowNotifs]=useState(false);
  const[readNotifIds,setReadNotifIds]=useState(new Set());

  const addToast=useCallback((message,type="success")=>{
    const id=Date.now();
    setToasts(p=>[...p,{id,message,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3000);
  },[]);

  const addEvent=useCallback((type,entity,message,level="INFO")=>{
    const id=genId("E");
    const date=new Date().toISOString().replace("T"," ").slice(0,16);
    setEvents(p=>[{id,date,type,entity,message,level},...p]);
  },[]);

  const createPO=useCallback((item)=>{
    const ex=pos.find(p=>p.sku===item.sku&&["BROUILLON","A_VALIDER"].includes(p.statut));
    if(ex){addEvent("GARDE_FOU",item.sku,`Création bloquée — PO ${ex.id} déjà ouvert`,`WARNING`);addToast(`PO existant pour ${item.sku}`,`warn`);return;}
    const sup=SUPPLIERS.find(s=>s.id===item.supplier_id);
    if(sup&&!sup.actif){addEvent("GARDE_FOU",item.sku,`Fournisseur inactif — ${sup.nom}`,`ERROR`);addToast(`Fournisseur ${sup.nom} inactif`,"error");return;}
    const qty=item.eoq;
    if(!qty||qty<=0){addToast("Quantité EOQ invalide","error");return;}
    const poId=genId("PO");
    const today="2026-03-16";
    const newPO={id:poId,sku:item.sku,article:item.article,supplier_id:item.supplier_id||1,
      supplier:sup?.nom||"TechParts SA",statut:"BROUILLON",qty,
      prix_negocie:Math.round(qty*item.cout_unit*0.95),prix_paye:null,
      date_creation:today,date_validation:null,date_envoi:null,date_reception:null};
    setPos(p=>[newPO,...p]);
    setStatusHistory(p=>[{poId,from:null,to:"BROUILLON",date:today,by:"Système"},...p]);
    const taskId=genId("T");
    setTasks(p=>[{id:taskId,titre:`Valider ${poId} — ${item.article}`,type:"Validation PO",
      assignee:"Marie Lavoie",echeance:today,status:"Ouverte",po_id:poId},...p]);
    if(qty>item.eoq*2){
      addEvent("GARDE_FOU",poId,`Qty ${qty} > EOQ×2 — approbation requise`,"WARNING");
    }
    addEvent("PO_CREATED",poId,`PO créé pour ${item.sku} — ${item.article} (qty: ${qty})`);
    addToast(`PO ${poId} créé ✓`);
    setActivePage("orders");
  },[pos,addToast,addEvent]);

  const transitionPO=useCallback((poId)=>{
    const po=pos.find(p=>p.id===poId);
    if(!po||!PO_TRANSITIONS[po.statut])return;
    const{next}=PO_TRANSITIONS[po.statut];
    const today="2026-03-16";
    const updates={statut:next};
    if(next==="A_VALIDER")updates.date_validation=today;
    if(next==="ENVOYÉ")updates.date_envoi=today;
    if(next==="REÇU"){updates.date_reception=today;updates.prix_paye=Math.round(po.prix_negocie*(0.97+Math.random()*0.06));}
    setPos(p=>p.map(x=>x.id===poId?{...x,...updates}:x));
    setStatusHistory(p=>[{poId,from:po.statut,to:next,date:today,by:"Utilisateur"},...p]);
    if(next==="ENVOYÉ"||next==="CLOS"){
      setTasks(p=>p.map(tk=>tk.po_id===poId&&tk.status!=="Terminée"?{...tk,status:"Terminée"}:tk));
    }
    addEvent("PO_TRANSITION",poId,`${poId} → ${next} depuis ${po.statut}`);
    addToast(`${poId} → ${next}`);
  },[pos,addEvent,addToast]);

  // Keyboard
  useEffect(()=>{
    const h=e=>{
      if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setGlobalSearch(s=>!s);}
      if(e.key==="Escape"){setSlideOver(null);setGlobalSearch(false);}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[]);

  // Badges
  const poAtt=pos.filter(p=>p.statut==="BROUILLON"||p.statut==="A_VALIDER").length;
  const auditCrit=events.filter(e=>e.level==="CRITICAL"||e.level==="ERROR").length;
  const excOuvertes=INITIAL_ECARTS.filter(a=>a.statut==="Ouvert"||a.statut==="En cours").length;
  const badgeCounts={po:poAtt,audit:auditCrit,surv:excOuvertes};

  // ── Notifications calculées dynamiquement ─────────────────────────────────
  const allNotifs = useMemo(() => {
    const notifs = [];
    // Ruptures de stock
    ITEMS_FULL.filter(i => i.statut_service === "Rupture").forEach(i => {
      notifs.push({
        id: "rupt-" + i.id,
        type: "rupture",
        icon: "🔴",
        color: "#EF4444",
        titre: "Rupture de stock",
        message: `${i.sku} — ${i.article}`,
        detail: `Stock net : ${i.stock_net} · Seuil : ${i.seuil_min}`,
        page: "surveillance",
        time: "Temps réel",
        urgence: 1,
      });
    });
    // PO en attente de validation
    pos.filter(p => p.statut === "BROUILLON" || p.statut === "A_VALIDER").forEach(p => {
      notifs.push({
        id: "po-" + p.id,
        type: "po",
        icon: "⏳",
        color: "#F59E0B",
        titre: p.statut === "BROUILLON" ? "PO en attente de soumission" : "PO en attente de validation",
        message: `${p.id} — ${p.article}`,
        detail: `${p.supplier} · ${p.qty} unités · ${p.prix_negocie?.toLocaleString()} $CA`,
        page: "orders",
        time: p.date_creation,
        urgence: p.statut === "A_VALIDER" ? 2 : 3,
      });
    });
    // Écarts non résolus
    INITIAL_ECARTS.filter(e => e.statut === "Ouvert" || e.statut === "En cours").forEach(e => {
      notifs.push({
        id: "ecart-" + e.id,
        type: "ecart",
        icon: "📋",
        color: "#8B5CF6",
        titre: "Écart d'inventaire non résolu",
        message: `${e.type} — ${e.sku || "SKU inconnu"}`,
        detail: `Responsable : ${e.responsable} · Gravité : ${e.gravite}`,
        page: "surveillance",
        time: e.date,
        urgence: e.gravite === "Élevée" ? 2 : 3,
      });
    });
    return notifs.sort((a, b) => a.urgence - b.urgence);
  }, [pos]);

  const unreadCount = allNotifs.filter(n => !readNotifIds.has(n.id)).length;
  const markAllRead = () => setReadNotifIds(new Set(allNotifs.map(n => n.id)));
  const markRead = (id) => setReadNotifIds(p => new Set([...p, id]));

  const dataCtx={pos,tasks,events,statusHistory,setActivePage,setSlideOver,createPO,transitionPO,addToast};
  const pages={dashboard:PageDashboard,stock:PageStockEditable,surveillance:PageSurveillance,inventory:PageInventory,
    processus:PageProcessus,kpi:PageKPI,abceoq:PageABCEOQ,
    suppliers:PageSuppliers,orders:PageOrders,audit:PageAudit,rules:PageRules};
  const PageComp=pages[activePage]||PageDashboard;
  const pageInfo=PAGE_INFO[activePage]||{};

  return(
    <ThemeCtx.Provider value={{t,theme,setTheme}}>
      <DataCtx.Provider value={dataCtx}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');
          *{box-sizing:border-box;margin:0;padding:0;}
          body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:${t.bg};color:${t.text};font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;}
          ::-webkit-scrollbar{width:5px;height:5px;}
          ::-webkit-scrollbar-track{background:transparent;}
          ::-webkit-scrollbar-thumb{background:${t.cardBorder};border-radius:3px;}
          input,select,textarea,button{font-family:'Inter',system-ui,-apple-system,sans-serif;}
          @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
          @keyframes slideRight{from{transform:translateX(-8px);opacity:0;}to{transform:translateX(0);opacity:1;}}
        `}</style>

        <div style={{display:"flex",minHeight:"100vh",background:t.bg}}>
          {/* ── SIDEBAR ── */}
          <div style={{
            width:sidebarCollapsed?64:230,background:t.sidebar,
            borderRight:`1px solid ${t.sidebarBorder}`,
            display:"flex",flexDirection:"column",flexShrink:0,
            transition:"width 0.25s ease",position:"fixed",
            top:0,left:0,bottom:0,zIndex:100,overflow:"hidden"
          }}>
            {/* Logo */}
            <div onClick={()=>setSidebarCollapsed(c=>!c)}
              style={{padding:sidebarCollapsed?"18px 0":"18px 16px",cursor:"pointer",
                display:"flex",alignItems:"center",gap:10,
                borderBottom:`1px solid ${t.sidebarBorder}`,marginBottom:8,
                justifyContent:sidebarCollapsed?"center":"flex-start"}}>
              <div style={{
                width:36,height:36,borderRadius:9,flexShrink:0,
                background:`linear-gradient(135deg,${t.accent},${t.purple})`,
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:`0 4px 12px ${t.accent}40`,
              }}>
                <span style={{fontSize:16,fontWeight:900,color:"#fff",letterSpacing:"-0.05em"}}>SP</span>
              </div>
              {!sidebarCollapsed&&<div>
                <div style={{fontSize:14,fontWeight:800,color:"#fff",letterSpacing:"-0.03em"}}>SupplyPilot</div>
                <div style={{fontSize:10,color:t.textMuted,fontWeight:500,marginTop:1}}>v3.0 · SIAG</div>
              </div>}
            </div>

            {/* Nav */}
            <nav style={{padding:"0 8px",flex:1,overflowY:"auto"}}>
              {/* Séances labels */}
              {!sidebarCollapsed&&[
                {before:"inventory",label:"SÉANCE 1-2"},
                {before:"processus",label:""},
                {before:"kpi",label:"SÉANCE 3-4"},
                {before:"abceoq",label:""},
                {before:"suppliers",label:"SÉANCE 5"},
                {before:"orders",label:""},
              ].filter(x=>x.label).map(x=>(
                <div key={x.before+x.label}/>
              ))}
              {NAV.map((nav,i)=>{
                const isA=activePage===nav.id;
                const bc=nav.badge?badgeCounts[nav.badge]:0;
                // section dividers
                const dividers=["stock","surveillance","processus","kpi","suppliers"];
                return(
                  <div key={nav.id}>
                    {!sidebarCollapsed&&dividers.includes(nav.id)&&(
                      <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",
                        letterSpacing:"0.1em",color:t.textMuted,padding:"14px 12px 6px",
                        borderTop:i>0?`1px solid ${t.sidebarBorder}40`:"none"}}>
                        {nav.id==="stock"?"─ Accès rapide":nav.id==="surveillance"?"─ Qualité":nav.id==="processus"?"─ Séance 1-2":nav.id==="kpi"?"─ Séance 3-4":"─ Séance 5"}
                      </div>
                    )}
                    <div onClick={()=>setActivePage(nav.id)}
                      style={{
                        display:"flex",alignItems:"center",gap:10,
                        padding:sidebarCollapsed?"10px 0":"9px 12px",
                        borderRadius:10,cursor:"pointer",marginBottom:2,
                        background:isA?t.accent+"18":"transparent",
                        borderLeft:isA?`3px solid ${t.accent}`:"3px solid transparent",
                        transition:"all 0.15s",
                        justifyContent:sidebarCollapsed?"center":"flex-start",
                        position:"relative"
                      }}>
                      <span style={{fontSize:15,flexShrink:0}}>{nav.icon}</span>
                      {!sidebarCollapsed&&<span style={{fontSize:12,fontWeight:isA?700:500,
                        color:isA?t.accent:"#8A9BBF",flex:1}}>{nav.label}</span>}
                      {bc>0&&!sidebarCollapsed&&(
                        <span style={{background:nav.badge==="po"?"#F59E0B":nav.badge==="surv"?"#F97316":"#EF4444",
                          color:"#fff",borderRadius:10,fontSize:9,fontWeight:700,
                          padding:"1px 6px",minWidth:18,textAlign:"center"}}>{bc}</span>
                      )}
                      {bc>0&&sidebarCollapsed&&(
                        <span style={{position:"absolute",top:6,right:8,width:7,height:7,
                          borderRadius:"50%",background:nav.badge==="po"?"#F59E0B":nav.badge==="surv"?"#F97316":"#EF4444"}}/>
                      )}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Theme toggle */}
            {!sidebarCollapsed&&(
              <div style={{padding:14,borderTop:`1px solid ${t.sidebarBorder}`}}>
                <button onClick={()=>setTheme(th=>th==="dark"?"light":"dark")}
                  style={{width:"100%",padding:"8px 12px",borderRadius:10,
                    border:`1px solid ${t.sidebarBorder}`,background:t.bg+"88",
                    color:"#8A9BBF",cursor:"pointer",display:"flex",
                    alignItems:"center",gap:8,fontSize:12}}>
                  <span>{theme==="dark"?"☀️":"🌙"}</span>
                  {theme==="dark"?"Mode clair":"Mode sombre"}
                </button>
              </div>
            )}
          </div>

          {/* ── MAIN ── */}
          <div style={{flex:1,marginLeft:sidebarCollapsed?64:230,
            transition:"margin-left 0.25s ease",display:"flex",
            flexDirection:"column",minHeight:"100vh"}}>

            {/* Header */}
            <div style={{background:t.surface,borderBottom:`1px solid ${t.cardBorder}`,
              padding:"14px 28px",display:"flex",alignItems:"center",gap:16,
              position:"sticky",top:0,zIndex:50,boxShadow:t.shadow}}>
              <div style={{flex:1}}>
                <div style={{fontSize:17,fontWeight:800,color:t.text,letterSpacing:"-0.03em",lineHeight:1.2}}>{pageInfo.title}</div>
                <div style={{fontSize:11,color:t.textMuted,marginTop:3,fontWeight:500,letterSpacing:"0.01em"}}>
                  16 mars 2026 &nbsp;·&nbsp; Q1 2026 &nbsp;·&nbsp; {pageInfo.sub}
                </div>
              </div>
              <button onClick={()=>setGlobalSearch(s=>!s)}
                style={{display:"flex",alignItems:"center",gap:8,padding:"7px 14px",
                  borderRadius:10,border:`1px solid ${t.inputBorder}`,
                  background:t.inputBg,color:t.textSub,cursor:"pointer",fontSize:12}}>
                🔍 Rechercher <kbd style={{fontSize:10,padding:"1px 5px",borderRadius:4,
                  border:`1px solid ${t.inputBorder}`,background:t.bg}}>⌘K</kbd>
              </button>

              {/* ── Cloche notifications ── */}
              <div style={{position:"relative"}}>
                <button onClick={()=>setShowNotifs(s=>!s)}
                  style={{position:"relative",padding:"8px 12px",borderRadius:10,
                    border:`1px solid ${unreadCount>0?t.danger+"60":t.inputBorder}`,
                    background:unreadCount>0?t.danger+"10":t.inputBg,
                    cursor:"pointer",fontSize:18,lineHeight:1,transition:"all 0.2s"}}>
                  🔔
                  {unreadCount > 0 && (
                    <span style={{
                      position:"absolute",top:-6,right:-6,
                      minWidth:18,height:18,borderRadius:9,
                      background:t.danger,color:"#fff",
                      fontSize:10,fontWeight:800,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      padding:"0 4px",border:`2px solid ${t.surface}`,
                    }}>{unreadCount}</span>
                  )}
                </button>

                {/* ── Menu déroulant ── */}
                {showNotifs && (
                  <>
                    <div onClick={()=>setShowNotifs(false)}
                      style={{position:"fixed",inset:0,zIndex:200}}/>
                    <div style={{
                      position:"absolute",top:"calc(100% + 10px)",right:0,
                      width:400,maxHeight:520,
                      background:t.card,border:`1px solid ${t.cardBorder}`,
                      borderRadius:16,boxShadow:"0 12px 40px rgba(0,0,0,0.3)",
                      zIndex:201,display:"flex",flexDirection:"column",
                      overflow:"hidden",
                    }}>
                      {/* En-tête */}
                      <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.cardBorder}`,
                        display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                        <div style={{fontSize:14,fontWeight:800,color:t.text}}>
                          🔔 Notifications
                          {unreadCount > 0 && (
                            <span style={{marginLeft:8,fontSize:11,fontWeight:600,
                              color:t.danger,background:t.danger+"15",
                              padding:"2px 8px",borderRadius:10}}>
                              {unreadCount} non lue{unreadCount>1?"s":""}
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead}
                            style={{fontSize:11,fontWeight:600,color:t.accent,
                              background:"none",border:"none",cursor:"pointer",padding:0}}>
                            Tout marquer lu
                          </button>
                        )}
                      </div>

                      {/* Groupes */}
                      <div style={{overflowY:"auto",flex:1}}>
                        {["rupture","po","ecart"].map(type => {
                          const group = allNotifs.filter(n => n.type === type);
                          if (group.length === 0) return null;
                          const labels = {
                            rupture: "🔴 Ruptures de stock",
                            po:      "⏳ PO en attente de validation",
                            ecart:   "📋 Écarts non résolus",
                          };
                          return (
                            <div key={type}>
                              <div style={{padding:"8px 18px 4px",fontSize:10,fontWeight:800,
                                textTransform:"uppercase",letterSpacing:"0.08em",color:t.textMuted,
                                background:t.bg}}>
                                {labels[type]} · {group.length}
                              </div>
                              {group.map(n => {
                                const isRead = readNotifIds.has(n.id);
                                return (
                                  <div key={n.id}
                                    onClick={() => {
                                      markRead(n.id);
                                      setActivePage(n.page);
                                      setShowNotifs(false);
                                    }}
                                    style={{
                                      display:"flex",gap:12,alignItems:"flex-start",
                                      padding:"11px 18px",cursor:"pointer",
                                      borderBottom:`1px solid ${t.cardBorder}15`,
                                      background:isRead?"transparent":n.color+"08",
                                      transition:"background 0.15s",
                                    }}
                                    onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                                    onMouseLeave={e=>e.currentTarget.style.background=isRead?"transparent":n.color+"08"}>
                                    {/* Indicateur non lu */}
                                    <div style={{width:7,height:7,borderRadius:"50%",
                                      background:isRead?"transparent":n.color,
                                      flexShrink:0,marginTop:5,
                                      boxShadow:isRead?"none":`0 0 6px ${n.color}`,
                                    }}/>
                                    <div style={{flex:1,minWidth:0}}>
                                      <div style={{display:"flex",justifyContent:"space-between",
                                        alignItems:"baseline",gap:8,marginBottom:2}}>
                                        <span style={{fontSize:12,fontWeight:isRead?500:700,
                                          color:isRead?t.textSub:t.text,
                                          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                                          {n.message}
                                        </span>
                                        <span style={{fontSize:10,color:t.textMuted,
                                          flexShrink:0,whiteSpace:"nowrap"}}>{n.time}</span>
                                      </div>
                                      <div style={{fontSize:11,color:t.textSub,lineHeight:1.4}}>
                                        {n.detail}
                                      </div>
                                    </div>
                                    <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",
                                      borderRadius:8,background:n.color+"20",color:n.color,
                                      flexShrink:0,alignSelf:"center"}}>→</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                        {allNotifs.length === 0 && (
                          <div style={{padding:32,textAlign:"center",color:t.textMuted,fontSize:13}}>
                            ✅ Aucune notification — tout est conforme
                          </div>
                        )}
                      </div>

                      {/* Pied */}
                      <div style={{padding:"10px 18px",borderTop:`1px solid ${t.cardBorder}`,
                        flexShrink:0,display:"flex",justifyContent:"space-between",
                        alignItems:"center"}}>
                        <span style={{fontSize:11,color:t.textMuted}}>
                          {allNotifs.length} notification{allNotifs.length>1?"s":""} au total
                        </span>
                        <button onClick={()=>{setActivePage("audit");setShowNotifs(false);}}
                          style={{fontSize:11,fontWeight:600,color:t.accent,
                            background:"none",border:"none",cursor:"pointer",padding:0}}>
                          Voir journal complet →
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button onClick={()=>setActivePage("surveillance")}
                style={{padding:"8px 18px",borderRadius:10,border:"none",
                  background:t.accent,color:"#000",cursor:"pointer",
                  fontSize:13,fontWeight:700,letterSpacing:"-0.01em"}}>
                + Nouveau PO
              </button>
            </div>

            {/* Content */}
            <div style={{flex:1,padding:24,overflowY:"auto"}}>
              <PageComp/>
            </div>
          </div>
        </div>

        {/* SlideOver */}
        <SlideOver open={!!slideOver} onClose={()=>setSlideOver(null)}>
          <SlideOverContent data={slideOver}/>
        </SlideOver>

        {/* Global search mini */}
        {globalSearch&&(
          <div onClick={()=>setGlobalSearch(false)}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",
              zIndex:9000,display:"flex",alignItems:"flex-start",
              justifyContent:"center",paddingTop:80}}>
            <div onClick={e=>e.stopPropagation()}
              style={{background:t.card,border:`1px solid ${t.cardBorder}`,
                borderRadius:16,width:560,overflow:"hidden",
                boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
              <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.cardBorder}`,
                display:"flex",alignItems:"center",gap:10}}>
                <span>🔍</span>
                <input autoFocus placeholder="Chercher SKU, article, PO…"
                  onKeyDown={e=>{if(e.key==="Escape")setGlobalSearch(false);}}
                  style={{flex:1,background:"none",border:"none",outline:"none",
                    fontSize:15,color:t.text,fontFamily:"inherit"}}/>
                <kbd style={{fontSize:10,padding:"2px 7px",borderRadius:5,
                  background:t.bg,color:t.textSub,border:`1px solid ${t.cardBorder}`}}>ESC</kbd>
              </div>
              <div style={{padding:20,display:"flex",flexDirection:"column",gap:8}}>
                {NAV.map(n=>(
                  <button key={n.id} onClick={()=>{setActivePage(n.id);setGlobalSearch(false);}}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",
                      borderRadius:10,border:`1px solid ${t.cardBorder}`,
                      background:"transparent",color:t.text,cursor:"pointer",
                      textAlign:"left",fontSize:13,fontFamily:"inherit"}}
                    onMouseEnter={e=>e.currentTarget.style.background=t.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span>{n.icon}</span>
                    <span style={{fontWeight:600}}>{n.label}</span>
                    <span style={{fontSize:11,color:t.textMuted,marginLeft:"auto"}}>{PAGE_INFO[n.id]?.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <ToastContainer toasts={toasts}/>
      </DataCtx.Provider>
    </ThemeCtx.Provider>
  );
}
ReactDOM.render(
  <App />, 
  document.getElementById('root')
);
