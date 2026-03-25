
    const STORAGE_KEY = "hippopogramme_v18_pwa";
    const QUESTIONS_URL = "./machine-questions.json";

    const REP_PRESETS = Array.from({length:25}, (_,i)=>i+1);
    const LOAD_ADJUSTMENTS = [-10,-5,-1,1,5,10];
    const SERIES_PRESETS = [1,2,3,4,5,6];

    const animals = [
      { name:"Lapin", weight:2, icon:"🐇" },
      { name:"Chat", weight:4, icon:"🐈" },
      { name:"Renard", weight:7, icon:"🦊" },
      { name:"Chien", weight:20, icon:"🐕" },
      { name:"Loup", weight:40, icon:"🐺" },
      { name:"Mouton", weight:80, icon:"🐑" },
      { name:"Panda", weight:100, icon:"🐼" },
      { name:"Sanglier", weight:120, icon:"🐗" },
      { name:"Gorille", weight:160, icon:"🦍" },
      { name:"Cerf", weight:180, icon:"🦌" },
      { name:"Lion", weight:190, icon:"🦁" },
      { name:"Zèbre", weight:320, icon:"🦓" },
      { name:"Cheval", weight:500, icon:"🐎" },
      { name:"Bison", weight:700, icon:"🦬" },
      { name:"Girafe", weight:1200, icon:"🦒" },
      { name:"Morse", weight:1600, icon:"🦭" },
      { name:"Buffle d'eau", weight:2000, icon:"🐃" },
      { name:"Rhinocéros", weight:2300, icon:"🦏" },
      { name:"Hippopotame", weight:3000, icon:"🦛" },
      { name:"Éléphant", weight:6000, icon:"🐘" },
      { name:"2 éléphants", weight:12000, icon:"" },
      { name:"3 éléphants", weight:18000, icon:"" },
      { name:"4 éléphants", weight:24000, icon:"" },
      { name:"5 éléphants", weight:30000, icon:"" },
      { name:"6 éléphants", weight:36000, icon:"" },
      { name:"7 éléphants", weight:42000, icon:"" },
      { name:"8 éléphants", weight:48000, icon:"" },
      { name:"9 éléphants", weight:54000, icon:"" },
      { name:"10 éléphants", weight:60000, icon:"" },
      { name:"Baleine bleue", weight:120000, icon:"🐋" }
    ].sort((a,b)=>a.weight-b.weight);

    const machineCatalog = [
      { id:"velo", name:"Vélo", tag:"Cardio", files:["machines/Velo.png"] },
      { id:"deltoides", name:"Deltoïdes", tag:"Épaules", files:["machines/deltoides.png"] },
      { id:"dc", name:"Développé couché", tag:"Pectoraux", files:["machines/Developpe Couche.png"] },
      { id:"dorso", name:"Dorso lombaire", tag:"Dos", files:["machines/Dorso Lombaire.png"] },
      { id:"ischios", name:"Ischios", tag:"Jambes", files:["machines/ischios.png"] },
      { id:"legcurl", name:"Leg Extension", tag:"Jambes", files:["machines/Leg Extension.png"] },
      { id:"pompes", name:"Pompes", tag:"Poids du corps", files:["machines/Pompes.png"] },
      { id:"presse", name:"Presse oblique", tag:"Jambes", files:["machines/Presse Oblique.png"] },
      { id:"rowing", name:"Rowing", tag:"Dos", files:["machines/Rowing.png"] },
      { id:"shoulder", name:"Shoulder Press", tag:"Épaules", files:["machines/Shoulder Press.png"] },
      { id:"tapis", name:"Tapis de course", tag:"Cardio", files:["machines/Tapis de course.png"] },
      { id:"tirage_assis", name:"Tirage assis", tag:"Dos", files:["machines/Tirage Assis.png"] },
      { id:"tractions", name:"Tractions", tag:"Poids du corps", files:["machines/Tractions.png"] },
      { id:"tirage_vertical", name:"Tirage Vertical", tag:"Dos", files:["machines/Tirage Vertical.png"] },
      { id:"biceps_curl", name:"Biceps Curl", tag:"Bras", files:["machines/Biceps Curl.png"] },
      { id:"butterfly", name:"Butterfly", tag:"Pectoraux", files:["machines/Butterfly.png"] },
      { id:"chaise_romaine", name:"Chaise Romaine", tag:"Abdos / Tronc", files:["machines/Chaise Romaine.png"] },
      { id:"squat", name:"Squat", tag:"Jambes", files:["machines/Squat.png"] },
      { id:"chest_press", name:"Chest Press", tag:"Pectoraux", files:["machines/Chest Press.png"] }
    ];

    let state = loadState();
    let selectedPersonId = null;
    let selectedMachineId = null;
    let pendingResult = null;
    let machineQuestions = {};
    let selectedRepValue = 10;
    let repManualMode = false;
    let selectedLoadValue = 30;
    const el = {};

    document.addEventListener("DOMContentLoaded", init);

    async function init(){
      cache();
      await loadMachineQuestions();
      bind();
      renderAnimals();
      renderAll();
      registerServiceWorker();
    }

    function cache(){
      [
        "pageHome","pagePrepare","pageChallenge",
        "navHome","navPrepare","navChallenge","resetBtn",
        "btnModeIndividual","btnModeTeam",
        "blockIndividual","blockTeams",
        "teamList","machineGrid","personButtons",
        "emptySelection","entrySection","selectedName","selectedMeta",
        "entryTotal","saveResult","cancelSelection","undoLastAction",
        "currentAnimal","nextAnimal","studentProgressBar","studentProgressText",
        "personHistory","ranking","statsTable",
        "challengeMachineGrid","individualList","addIndividualBtn",
        "balanceTeamsCheckbox","securityQuestionsCheckbox","quizContainer",
        "individualSeriesLimitCheckbox","teamSeriesLimitCheckbox",
        "teamCountButtons","individualSeriesButtons","teamSeriesButtons",
        "repsButtons","loadButtons","entryRepsManual","entryLoadManual",
        "fullscreenBtn","rankingSummary","saveConfirmOverlay","saveConfirmText",
        "confirmSaveBtn","cancelSaveBtn"
      ].forEach(id => el[id] = document.getElementById(id));
    }

    async function loadMachineQuestions(){
      try{
        const response = await fetch(QUESTIONS_URL, {cache:"no-store"});
        if(!response.ok) throw new Error("questions file not found");
        const data = await response.json();
        machineQuestions = data || {};
      }catch(e){
        machineQuestions = {};
      }
      ensureQuestionsStructure();
    }

    function bind(){
      el.navHome.addEventListener("click", ()=>showPage("home"));
      el.navPrepare.addEventListener("click", ()=>showPage("prepare"));
      el.navChallenge.addEventListener("click", ()=>showPage("challenge"));

      el.resetBtn.addEventListener("click", resetAll);
      el.fullscreenBtn.addEventListener("click", toggleFullscreen);

      el.btnModeIndividual.addEventListener("click", ()=>{
        state.mode = "individual";
        selectedPersonId = null;
        saveState();
        renderAll();
      });

      el.btnModeTeam.addEventListener("click", ()=>{
        state.mode = "team";
        if(!state.teams.length){
          state.teams = [
            makeTeam(1,"Équipe 1","#3b82f6",3),
            makeTeam(2,"Équipe 2","#ef4444",3)
          ];
        }
        selectedPersonId = null;
        saveState();
        renderAll();
      });

      el.teamCountButtons.addEventListener("click", (e)=>{
        const btn = e.target.closest(".choiceBtn");
        if(!btn) return;
        const count = parseInt(btn.dataset.teamCount, 10);
        if(Number.isNaN(count)) return;
        setTeamCount(count);
      });

      el.individualSeriesButtons.addEventListener("click", (e)=>{
        const btn = e.target.closest(".choiceBtn");
        if(!btn) return;
        const value = parseInt(btn.dataset.seriesValue, 10);
        if(Number.isNaN(value)) return;
        state.individualSeriesLimitValue = value;
        saveState();
        renderSeriesButtons();
      });

      el.teamSeriesButtons.addEventListener("click", (e)=>{
        const btn = e.target.closest(".choiceBtn");
        if(!btn) return;
        const value = parseInt(btn.dataset.seriesValue, 10);
        if(Number.isNaN(value)) return;
        state.teamSeriesLimitValue = value;
        saveState();
        renderSeriesButtons();
      });

      el.repsButtons.addEventListener("click", (e)=>{
        const btn = e.target.closest(".choiceBtn");
        if(!btn) return;

        if(btn.dataset.repManual === "1") {
          repManualMode = true;
          el.entryRepsManual.style.display = "block";
          el.entryRepsManual.focus();
          renderRepButtons();
          updateCalcPreview();
          return;
        }

        const value = parseInt(btn.dataset.repValue, 10);
        if(Number.isNaN(value)) return;
        selectedRepValue = value;
        repManualMode = false;
        el.entryRepsManual.value = "";
        el.entryRepsManual.style.display = "none";
        renderRepButtons();
        updateCalcPreview();
      });

      el.loadButtons.addEventListener("click", (e)=>{
        const btn = e.target.closest(".choiceBtn");
        if(!btn) return;
        const delta = parseInt(btn.dataset.loadDelta, 10);
        if(Number.isNaN(delta)) return;
        const nextValue = Math.max(1, Math.min(200, getLoadValue() + delta));
        selectedLoadValue = nextValue;
        el.entryLoadManual.value = String(nextValue);
        renderLoadButtons();
        updateCalcPreview();
      });

      el.entryRepsManual.addEventListener("input", ()=>{
        repManualMode = String(el.entryRepsManual.value ?? "").trim() !== "";
        renderRepButtons();
        updateCalcPreview();
      });

      el.entryLoadManual.addEventListener("input", ()=>{
        const raw = String(el.entryLoadManual.value ?? "").trim();
        if(raw !== "") selectedLoadValue = sanitizeBoundedIntFinal(raw, selectedLoadValue, 1, 200);
        renderLoadButtons();
        updateCalcPreview();
      });

      el.entryRepsManual.addEventListener("blur", ()=>{
        const current = getRepsValue();
        if(repManualMode){
          el.entryRepsManual.value = current;
          el.entryRepsManual.style.display = "block";
        } else {
          el.entryRepsManual.value = "";
          el.entryRepsManual.style.display = "none";
        }
        renderRepButtons();
        updateCalcPreview();
      });

      el.entryLoadManual.addEventListener("blur", ()=>{
        const current = getLoadValue();
        selectedLoadValue = current;
        el.entryLoadManual.value = String(current);
        renderLoadButtons();
        updateCalcPreview();
      });

      el.addIndividualBtn.addEventListener("click", ()=>{
        state.individuals.push({id:"ind_"+uid(), name:"Nouvel élève", results:[]});
        saveState();
        renderAll();
      });

      el.balanceTeamsCheckbox.addEventListener("change", ()=>{
        state.balanceTeams = !!el.balanceTeamsCheckbox.checked;
        saveState();
        renderRanking();
      });

      el.securityQuestionsCheckbox.addEventListener("change", ()=>{
        state.securityQuestionsEnabled = !!el.securityQuestionsCheckbox.checked;
        saveState();
      });

      el.individualSeriesLimitCheckbox.addEventListener("change", ()=>{
        state.individualSeriesLimitEnabled = !!el.individualSeriesLimitCheckbox.checked;
        saveState();
      });

      el.teamSeriesLimitCheckbox.addEventListener("change", ()=>{
        state.teamSeriesLimitEnabled = !!el.teamSeriesLimitCheckbox.checked;
        saveState();
      });

      el.machineGrid.addEventListener("click", (e)=>{
        const card = e.target.closest(".machineCard");
        if(!card) return;
        const id = card.dataset.id;
        if(state.selectedMachines.includes(id)){
          state.selectedMachines = state.selectedMachines.filter(x=>x!==id);
        }else{
          state.selectedMachines.push(id);
        }
        saveState();
        renderMachines();
        renderEntry();
      });

      el.personButtons.addEventListener("click", (e)=>{
        const btn = e.target.closest(".personBtn");
        if(!btn) return;
        selectedPersonId = btn.dataset.id;
        renderPeople();
        renderEntry();
      });

      el.challengeMachineGrid.addEventListener("click", (e)=>{
        const card = e.target.closest(".challengeMachineCard");
        if(!card) return;
        selectedMachineId = card.dataset.id;
        renderChallengeMachinePicker();
      });

      el.saveResult.addEventListener("click", ()=>{
        if(!selectedPersonId) return;
        const person = findPerson(selectedPersonId);
        if(!person) return;

        const machineId = selectedMachineId;
        const reps = getRepsValue();
        const load = getLoadValue();
        const total = reps * load;

        if(!machineId){
          alert("Choisir une machine en cliquant sur sa miniature.");
          return;
        }

        const seriesLimit = getSeriesLimit();
        if(seriesLimit.enabled && (person.results || []).length >= seriesLimit.value){
          alert(`Nombre maximum de séries atteint : ${seriesLimit.value}.`);
          return;
        }

        const baseResult = {
          id:uid(),
          date:new Date().toLocaleString("fr-FR"),
          machineId,
          machineName:getMachine(machineId)?.name || machineId,
          reps,
          load,
          total,
          securityApplied:false,
          securityCorrect:null,
          totalBeforePenalty:total
        };

        openSaveConfirm(person, baseResult);
      });

      el.undoLastAction.addEventListener("click", ()=>{
        if(!selectedPersonId) return;
        const person = findPerson(selectedPersonId);
        if(!person || !person.results.length){
          alert("Aucune action à supprimer pour cet élève.");
          return;
        }
        person.results.pop();
        saveState();
        renderAll();
      });

      el.cancelSelection.addEventListener("click", ()=>{
        selectedPersonId = null;
        selectedMachineId = null;
        pendingResult = null;
        renderAll();
      });

      updateCalcPreview();
      document.addEventListener("fullscreenchange", renderFullscreenButton);
      window.matchMedia?.("(display-mode: fullscreen)")?.addEventListener?.("change", renderFullscreenButton);
      window.matchMedia?.("(display-mode: standalone)")?.addEventListener?.("change", renderFullscreenButton);
    }

    function sanitizePositiveIntFinal(value, fallback){
      const trimmed = String(value ?? "").trim();
      if(trimmed === "") return fallback;
      const n = parseInt(trimmed, 10);
      if (Number.isNaN(n) || n < 1) return fallback;
      return n;
    }

    function sanitizeBoundedIntFinal(value, fallback, min, max){
      const trimmed = String(value ?? "").trim();
      if(trimmed === "") return fallback;
      let n = parseInt(trimmed, 10);
      if (Number.isNaN(n)) n = fallback;
      if (n < min) n = min;
      if (n > max) n = max;
      return n;
    }

    function getRepsValue(){
      const raw = String(el.entryRepsManual.value ?? "").trim();
      if(raw !== ""){
        return sanitizeBoundedIntFinal(raw, selectedRepValue, 1, 40);
      }
      return selectedRepValue;
    }

    function getLoadValue(){
      const raw = String(el.entryLoadManual.value ?? "").trim();
      if(raw !== ""){
        return sanitizeBoundedIntFinal(raw, selectedLoadValue, 1, 200);
      }
      return selectedLoadValue;
    }

    function updateCalcPreview(){
      const reps = getRepsValue();
      const load = getLoadValue();
      el.entryTotal.textContent = formatKg(reps * load);
    }

    function getSeriesLimit(){
      if(state.mode === "individual"){
        return {
          enabled: !!state.individualSeriesLimitEnabled,
          value: sanitizePositiveIntFinal(state.individualSeriesLimitValue, 3)
        };
      }
      return {
        enabled: !!state.teamSeriesLimitEnabled,
        value: sanitizePositiveIntFinal(state.teamSeriesLimitValue, 3)
      };
    }

    function setTeamCount(count){
      const safeCount = Math.max(1, Math.min(6, count));
      const palette = ["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899"];

      while(state.teams.length < safeCount){
        const idx = state.teams.length;
        state.teams.push(makeTeam(idx+1, `Équipe ${idx+1}`, palette[idx % palette.length], 3));
      }

      while(state.teams.length > safeCount){
        const removed = state.teams.pop();
        if(removed && removed.students.some(s=>s.id===selectedPersonId)) selectedPersonId = null;
      }

      saveState();
      renderAll();
    }

    function renderTeamCountButtons(){
      const current = Math.max(1, Math.min(6, state.teams.length || 2));
      el.teamCountButtons.innerHTML = [1,2,3,4,5,6].map(n=>`
        <button type="button" class="choiceBtn ${n===current ? "active" : ""}" data-team-count="${n}">${n}</button>
      `).join("");
    }

    function renderSeriesButtons(){
      const indivCurrent = sanitizePositiveIntFinal(state.individualSeriesLimitValue, 3);
      el.individualSeriesButtons.innerHTML = SERIES_PRESETS.map(n=>`
        <button type="button" class="choiceBtn ${n===indivCurrent ? "active" : ""}" data-series-value="${n}">${n}</button>
      `).join("");

      const teamCurrent = sanitizePositiveIntFinal(state.teamSeriesLimitValue, 3);
      el.teamSeriesButtons.innerHTML = SERIES_PRESETS.map(n=>`
        <button type="button" class="choiceBtn ${n===teamCurrent ? "active" : ""}" data-series-value="${n}">${n}</button>
      `).join("");
    }

    function renderRepButtons(){
      const manualRaw = String(el.entryRepsManual.value ?? "").trim();
      const current = manualRaw !== "" ? sanitizeBoundedIntFinal(manualRaw, selectedRepValue, 1, 40) : selectedRepValue;
      el.entryRepsManual.style.display = repManualMode ? "block" : "none";

      el.repsButtons.innerHTML = REP_PRESETS.map(n=>`
        <button type="button" class="choiceBtn ${!repManualMode && n===current ? "active" : ""}" data-rep-value="${n}">${n}</button>
      `).join("") + `<button type="button" class="choiceBtn ${repManualMode ? "active" : ""}" data-rep-manual="1">Saisie manuelle</button>`;
    }

    function renderLoadButtons(){
      const current = getLoadValue();
      selectedLoadValue = current;
      el.entryLoadManual.value = String(current);

      el.loadButtons.innerHTML = LOAD_ADJUSTMENTS.map(delta=>`
        <button type="button" class="choiceBtn choiceBtnAdjust" data-load-delta="${delta}">${delta > 0 ? "+" : ""}${delta}</button>
      `).join("");
    }

    function openSaveConfirm(person, baseResult){
      el.saveConfirmText.innerHTML = `
        <strong>${escHtml(person.name)}</strong><br>
        ${escHtml(baseResult.machineName)}<br>
        ${baseResult.reps} répétitions × ${baseResult.load} kg = <strong>${formatKg(baseResult.total)}</strong>
      `;
      el.saveConfirmOverlay.style.display = "flex";

      el.confirmSaveBtn.onclick = ()=>{
        closeSaveConfirm();
        finalizeResultSave(person.id, baseResult);
      };

      el.cancelSaveBtn.onclick = ()=>{
        closeSaveConfirm();
      };
    }

    function closeSaveConfirm(){
      el.saveConfirmOverlay.style.display = "none";
    }

    function finalizeResultSave(personId, baseResult){
      const person = findPerson(personId);
      if(!person) return;

      if(state.securityQuestionsEnabled){
        pendingResult = {
          personId,
          result: baseResult
        };
        showSecurityQuestion(baseResult.machineId);
      } else {
        person.results.push(baseResult);
        saveState();
        renderAll();
      }
    }

    function isStandaloneDisplay(){
      return window.matchMedia?.("(display-mode: fullscreen)")?.matches
        || window.matchMedia?.("(display-mode: standalone)")?.matches
        || window.navigator.standalone === true;
    }

    function toggleFullscreen(){
      const doc = document;
      const root = doc.documentElement;
      if(!doc.fullscreenElement){
        const req = root.requestFullscreen || root.webkitRequestFullscreen || root.msRequestFullscreen;
        if(req) req.call(root);
      } else {
        const exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        if(exit) exit.call(doc);
      }
      setTimeout(renderFullscreenButton, 120);
    }

    function renderFullscreenButton(){
      if(!el.fullscreenBtn) return;
      const active = !!document.fullscreenElement;
      if(active){
        el.fullscreenBtn.textContent = "Quitter le plein écran";
      } else if(isStandaloneDisplay()){
        el.fullscreenBtn.textContent = "Plein écran natif";
      } else {
        el.fullscreenBtn.textContent = "Plein écran";
      }
    }

    function getClassTotal(){
      return getAllPeople().reduce((sum,p)=>sum + getPersonTotal(p), 0);
    }

    function getSeriesStats(person){
      const count = (person.results || []).length;
      const maxCount = Math.max(0, ...getAllPeople().map(x=>(x.results || []).length));
      return {
        count,
        lag: Math.max(0, maxCount - count)
      };
    }

    function resetAll(){
      if(!confirm("Réinitialiser toutes les données ?")) return;
      state = defaultState();
      selectedPersonId = null;
      selectedMachineId = null;
      pendingResult = null;
      selectedRepValue = 10;
      repManualMode = false;
      selectedLoadValue = 30;
      saveState();
      renderAll();
      showPage("home");
    }

    function defaultQuestionSet(machineName){
      return [
        {
          question:`Quel réglage de sécurité dois-tu vérifier avant d'utiliser ${machineName} ?`,
          correct:"La stabilité du poste et le réglage adapté à ma morphologie",
          wrong1:"La couleur de la machine",
          wrong2:"Le nombre d'élèves dans la salle"
        },
        {
          question:`Quel comportement moteur est prioritaire sur ${machineName} ?`,
          correct:"Garder une posture contrôlée et un placement stable",
          wrong1:"Aller le plus vite possible sans contrôle",
          wrong2:"Bloquer la respiration pendant tout l'effort"
        },
        {
          question:`Avant de finir la série sur ${machineName}, que faut-il faire ?`,
          correct:"Reposer ou accompagner la charge en sécurité",
          wrong1:"Lâcher la charge dès que la série est terminée",
          wrong2:"Tourner le dos à la machine pendant le mouvement"
        }
      ];
    }

    function defaultState(){
      return {
        mode:"individual",
        balanceTeams:false,
        securityQuestionsEnabled:false,
        individualSeriesLimitEnabled:false,
        individualSeriesLimitValue:3,
        teamSeriesLimitEnabled:false,
        teamSeriesLimitValue:3,
        individuals:[
          {id:"ind_1_"+uid(), name:"Élève 1", results:[]},
          {id:"ind_2_"+uid(), name:"Élève 2", results:[]},
          {id:"ind_3_"+uid(), name:"Élève 3", results:[]}
        ],
        teams:[
          makeTeam(1,"Équipe 1","#3b82f6",3),
          makeTeam(2,"Équipe 2","#ef4444",3)
        ],
        selectedMachines:["presse","dc","rowing","velo","tapis","pompes","deltoides","tirage_vertical","biceps_curl","butterfly","chaise_romaine","squat","chest_press"]
      };
    }

    function makeTeam(index,name,color,count){
      return {
        id:"team_"+index+"_"+uid(),
        name,
        color,
        students:Array.from({length:count}, (_,i)=>({
          id:"team_"+index+"_student_"+(i+1)+"_"+uid(),
          name:"Élève "+(i+1),
          results:[]
        }))
      };
    }

    function loadState(){
      try{
        const raw = localStorage.getItem(STORAGE_KEY);
        if(!raw) return defaultState();
        const s = JSON.parse(raw);
        return normalizeState(s);
      }catch(e){
        return defaultState();
      }
    }

    function normalizeState(s){
      const d = defaultState();
      return {
        mode: s?.mode === "team" ? "team" : "individual",
        balanceTeams: !!s?.balanceTeams,
        securityQuestionsEnabled: !!s?.securityQuestionsEnabled,
        individualSeriesLimitEnabled: !!s?.individualSeriesLimitEnabled,
        individualSeriesLimitValue: sanitizePositiveIntFinal(s?.individualSeriesLimitValue, 3),
        teamSeriesLimitEnabled: !!s?.teamSeriesLimitEnabled,
        teamSeriesLimitValue: sanitizePositiveIntFinal(s?.teamSeriesLimitValue, 3),
        individuals: Array.isArray(s?.individuals) ? s.individuals.map(p=>({
          id:p.id || uid(),
          name:p.name || "Élève",
          results:Array.isArray(p.results) ? p.results : []
        })) : d.individuals,
        teams: Array.isArray(s?.teams) && s.teams.length ? s.teams.map((t,ti)=>({
          id:t.id || uid(),
          name:t.name || ("Équipe "+(ti+1)),
          color:t.color || ["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899"][ti % 6],
          students:Array.isArray(t.students) ? t.students.map((p,pi)=>({
            id:p.id || uid(),
            name:p.name || ("Élève "+(pi+1)),
            results:Array.isArray(p.results) ? p.results : []
          })) : []
        })) : d.teams,
        selectedMachines: Array.isArray(s?.selectedMachines) && s.selectedMachines.length ? s.selectedMachines : d.selectedMachines
      };
    }

    function ensureQuestionsStructure(){
      const normalized = {};
      machineCatalog.forEach(machine=>{
        const src = machineQuestions[machine.id];
        if(Array.isArray(src) && src.length === 3){
          normalized[machine.id] = src.map((q, idx)=>({
            question: q?.question || defaultQuestionSet(machine.name)[idx].question,
            correct: q?.correct || defaultQuestionSet(machine.name)[idx].correct,
            wrong1: q?.wrong1 || defaultQuestionSet(machine.name)[idx].wrong1,
            wrong2: q?.wrong2 || defaultQuestionSet(machine.name)[idx].wrong2
          }));
        } else {
          normalized[machine.id] = defaultQuestionSet(machine.name);
        }
      });
      machineQuestions = normalized;
    }

    function isDarkColor(hex){
      const clean = String(hex || "").replace("#","");
      if(clean.length !== 6) return false;
      const r = parseInt(clean.slice(0,2),16);
      const g = parseInt(clean.slice(2,4),16);
      const b = parseInt(clean.slice(4,6),16);
      const luminance = (0.299*r + 0.587*g + 0.114*b);
      return luminance < 150;
    }

    function saveState(){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function renderAll(){
      renderAnimals();
      renderPrepareMode();
      renderTeamCountButtons();
      renderSeriesButtons();
      renderRepButtons();
      renderLoadButtons();
      renderIndividuals();
      renderTeams();
      renderMachines();
      renderPeople();
      renderEntry();
      renderRanking();
      renderFullscreenButton();
      renderStatsTable();
      saveState();
    }

    function renderAnimals(){
      document.getElementById("animalScale").innerHTML = animals.map(a=>`
        <div class="animalItem">
          <strong>${a.icon ? a.icon + " " : ""}${a.name}</strong>
          <div class="muted">${formatKg(a.weight)}</div>
        </div>
      `).join("");
    }

    function renderPrepareMode(){
      const individual = state.mode === "individual";
      el.btnModeIndividual.classList.toggle("selected", individual);
      el.btnModeTeam.classList.toggle("selected", !individual);
      el.blockIndividual.style.display = individual ? "block" : "none";
      el.blockTeams.style.display = individual ? "none" : "block";
      el.balanceTeamsCheckbox.checked = !!state.balanceTeams;
      el.securityQuestionsCheckbox.checked = !!state.securityQuestionsEnabled;
      el.individualSeriesLimitCheckbox.checked = !!state.individualSeriesLimitEnabled;
      el.teamSeriesLimitCheckbox.checked = !!state.teamSeriesLimitEnabled;
    }

    function renderIndividuals(){
      if(state.mode !== "individual") return;

      el.individualList.innerHTML = state.individuals.map(person=>`
        <div class="studentBox">
          <div class="studentRow">
            <input value="${esc(person.name)}" data-person-id="${person.id}" class="indName">
            <button class="danger small" type="button" data-remove-ind="${person.id}">Supprimer</button>
          </div>
        </div>
      `).join("");

      el.individualList.querySelectorAll(".indName").forEach(inp=>{
        inp.addEventListener("input", ()=>{
          const p = state.individuals.find(x=>x.id===inp.dataset.personId);
          if(p){
            p.name = inp.value;
          }
        });
        inp.addEventListener("blur", ()=>{
          saveState();
          renderPeople();
          renderStatsTable();
        });
      });

      el.individualList.querySelectorAll("[data-remove-ind]").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          state.individuals = state.individuals.filter(p=>p.id !== btn.dataset.removeInd);
          if(selectedPersonId === btn.dataset.removeInd) selectedPersonId = null;
          saveState();
          renderAll();
        });
      });
    }

    function renderTeams(){
      if(state.mode !== "team") return;

      el.teamList.innerHTML = state.teams.map(team=>`
        <div class="teamBox">
          <div class="teamHeader">
            <div class="row" style="flex:1;">
              <div class="field" style="min-width:150px;">
                <label>Nom équipe</label>
                <input value="${esc(team.name)}" data-team-name="${team.id}">
              </div>
              <div class="field" style="max-width:90px;">
                <label>Couleur</label>
                <input type="color" value="${team.color}" data-team-color="${team.id}">
              </div>
            </div>
            <button class="danger small" type="button" data-remove-team="${team.id}">Supprimer</button>
          </div>

          <div class="smallText" style="margin-bottom:6px;">
            <span class="colorDot" style="background:${team.color};"></span>${team.name}
          </div>

          <div class="listBox">
            ${team.students.map(student=>`
              <div class="studentRow">
                <input value="${esc(student.name)}" data-team-student="${team.id}__${student.id}">
                <button class="danger small" type="button" data-remove-student="${team.id}__${student.id}">Supprimer</button>
              </div>
            `).join("")}
            <button class="ghost small" type="button" data-add-student="${team.id}">+ Ajouter un élève</button>
          </div>
        </div>
      `).join("");

      el.teamList.querySelectorAll("[data-team-name]").forEach(inp=>{
        inp.addEventListener("input", ()=>{
          const t = state.teams.find(x=>x.id===inp.dataset.teamName);
          if(t){
            t.name = inp.value;
          }
        });
        inp.addEventListener("blur", ()=>{
          saveState();
          renderPeople();
          renderRanking();
          renderStatsTable();
        });
      });

      el.teamList.querySelectorAll("[data-team-color]").forEach(inp=>{
        inp.addEventListener("input", ()=>{
          const t = state.teams.find(x=>x.id===inp.dataset.teamColor);
          if(t){
            t.color = inp.value;
            saveState();
            renderPeople();
            renderRanking();
            renderStatsTable();
          }
        });
      });

      el.teamList.querySelectorAll("[data-team-student]").forEach(inp=>{
        inp.addEventListener("input", ()=>{
          const [teamId, studentId] = inp.dataset.teamStudent.split("__");
          const team = state.teams.find(t=>t.id===teamId);
          const student = team?.students.find(s=>s.id===studentId);
          if(student){
            student.name = inp.value;
          }
        });
        inp.addEventListener("blur", ()=>{
          saveState();
          renderPeople();
          renderStatsTable();
        });
      });

      el.teamList.querySelectorAll("[data-remove-team]").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          state.teams = state.teams.filter(t=>t.id !== btn.dataset.removeTeam);
          if(state.teams.length === 0){
            state.teams.push(makeTeam(1,"Équipe 1","#3b82f6",3));
          }
          saveState();
          renderAll();
        });
      });

      el.teamList.querySelectorAll("[data-add-student]").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          const t = state.teams.find(x=>x.id===btn.dataset.addStudent);
          if(!t) return;
          t.students.push({id:"st_"+uid(), name:"Élève "+(t.students.length+1), results:[]});
          saveState();
          renderAll();
        });
      });

      el.teamList.querySelectorAll("[data-remove-student]").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          const [teamId, studentId] = btn.dataset.removeStudent.split("__");
          const team = state.teams.find(t=>t.id===teamId);
          if(!team) return;
          team.students = team.students.filter(s=>s.id !== studentId);
          if(selectedPersonId === studentId) selectedPersonId = null;
          saveState();
          renderAll();
        });
      });
    }

    function stripAccents(str){
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function unique(arr){
      return [...new Set(arr.filter(Boolean))];
    }

    function buildCandidates(files){
      const out = [];
      files.forEach(f=>{
        out.push(f);
        out.push(stripAccents(f));
        out.push(f.replaceAll(" ","_"));
        out.push(stripAccents(f).replaceAll(" ","_"));
        out.push(f.toLowerCase());
        out.push(stripAccents(f).toLowerCase());
        out.push(f.replaceAll(" ","-"));
        out.push(stripAccents(f).replaceAll(" ","-"));
        out.push(f.replaceAll("_"," "));
        out.push(stripAccents(f.replaceAll("_"," ")));
      });
      return unique(out);
    }

    function resolveImgTag(machine){
      const files = buildCandidates(machine.files || []);
      const first = files[0] || "";
      const safe = files.map(f=>f.replace(/\\/g,"\\\\").replace(/'/g,"\\'"));
      const onerrorJs = `
        (function(img){
          var list=['${safe.join("','")}'];
          var i=Number(img.dataset.tryindex||0)+1;
          if(i<list.length){img.dataset.tryindex=i;img.src=list[i];}
          else{img.style.display='none';}
        })(this)
      `.replace(/\n/g," ");
      return `<img src="${escapeAttr(first)}" alt="${escapeAttr(machine.name)}" onerror="${onerrorJs}">`;
    }

    function renderMachines(){
      el.machineGrid.innerHTML = machineCatalog.map(m=>{
        const selected = state.selectedMachines.includes(m.id);
        return `
          <div class="machineCard ${selected ? "selected" : ""}" data-id="${m.id}">
            <div class="machineVisual">${resolveImgTag(m)}</div>
            <div class="machineName">${m.name}</div>
            <div class="machineTag">${m.tag}</div>
          </div>
        `;
      }).join("");
    }

    function getAllPeople(){
      if(state.mode === "individual"){
        return state.individuals.map(p=>({
          ...p,
          teamId:null,
          teamName:"Individuel",
          teamColor:"#cbd5e1"
        }));
      }
      return state.teams.flatMap(team => team.students.map(student=>({
        ...student,
        teamId:team.id,
        teamName:team.name,
        teamColor:team.color
      })));
    }

    function findPerson(id){
      if(state.mode === "individual"){
        return state.individuals.find(p=>p.id===id);
      }
      for(const team of state.teams){
        const p = team.students.find(s=>s.id===id);
        if(p) return p;
      }
      return null;
    }

    function renderPeople(){
      const people = getAllPeople();
      if(!people.length){
        el.personButtons.innerHTML = `<div class="empty">Aucun participant configuré.</div>`;
        return;
      }

      el.personButtons.innerHTML = people.map(p=>{
        const bg = state.mode === "team" ? p.teamColor : "#cbd5e1";
        const textClass = isDarkColor(bg) ? "lightText" : "darkText";
        const stats = getSeriesStats(p);
        return `
          <button
            class="personBtn ${selectedPersonId===p.id ? "active" : ""} ${state.mode==="individual" ? "individual" : ""} ${textClass} ${stats.lag > 5 ? "flashLag" : ""}"
            data-id="${p.id}"
            type="button"
            style="${state.mode==="team" ? `background:${escapeAttr(bg)};` : ""}"
          >
            <span class="personBtnContent">
              <span class="personName">${escHtml(p.name)}</span>
              <span class="personMeta">
                <span class="personCountBadge">${stats.count} saisie${stats.count > 1 ? "s" : ""}</span>
                ${stats.lag > 5 ? `<span class="personLag">Retard ${stats.lag}</span>` : ""}
              </span>
            </span>
          </button>
        `;
      }).join("");
    }

    function renderEntry(){
      const selected = selectedPersonId ? getAllPeople().find(p=>p.id===selectedPersonId) : null;
      const availableMachines = machineCatalog.filter(m => state.selectedMachines.includes(m.id));

      if(!selectedMachineId || !availableMachines.some(m => m.id === selectedMachineId)){
        selectedMachineId = availableMachines[0]?.id || null;
      }

      renderRepButtons();
      renderLoadButtons();
      updateCalcPreview();

      if(!selected){
        el.emptySelection.style.display = "block";
        el.entrySection.style.display = "none";
        hideQuiz();
        return;
      }

      el.emptySelection.style.display = "none";
      el.entrySection.style.display = "block";

      const total = getPersonTotal(selected);
      const current = getCurrentAnimal(total);
      const next = getNextAnimal(total);
      const progression = getProgressToNext(total);

      const seriesStats = getSeriesStats(selected);
      el.selectedName.textContent = selected.name + (state.mode === "team" ? " • " + selected.teamName : "");
      el.selectedMeta.textContent = `Cumul actuel : ${formatKg(total)} • ${seriesStats.count} saisie${seriesStats.count > 1 ? "s" : ""}`;

      el.currentAnimal.textContent = current.name;
      el.nextAnimal.textContent = next ? next.name : "Maximum atteint";
      el.studentProgressBar.style.width = progression.percent + "%";
      el.studentProgressText.textContent = progression.text;

      renderChallengeMachinePicker();

      const person = findPerson(selected.id);
      const history = person?.results || [];
      el.personHistory.innerHTML = history.length
        ? history.slice().reverse().map(r=>`
            <div class="historyItem">
              <strong>${r.machineName}</strong><br>
              ${r.reps} répétitions × ${r.load} kg = <strong>${formatKg(r.total)}</strong>
              ${r.securityApplied ? `<br><span class="smallText">Connaissances machines : ${r.securityCorrect ? "réussies" : "échouées (-50 %)"}</span>` : ""}
              <br><span class="smallText">${r.date}</span>
            </div>
          `).join("")
        : `<div class="empty">Aucune performance enregistrée.</div>`;
    }

    function renderChallengeMachinePicker(){
      const availableMachines = machineCatalog.filter(m => state.selectedMachines.includes(m.id));

      el.challengeMachineGrid.innerHTML = availableMachines.length
        ? availableMachines.map(m=>`
            <div class="challengeMachineCard ${selectedMachineId===m.id ? "active" : ""}" data-id="${m.id}">
              <div class="challengeMachineThumb">${resolveImgTag(m)}</div>
              <div class="machineName" style="min-height:auto;font-size:11px;margin-top:5px;">${m.name}</div>
            </div>
          `).join("")
        : `<div class="empty">Aucune machine sélectionnée dans la préparation.</div>`;
    }

    function showSecurityQuestion(machineId){
      const questions = machineQuestions[machineId] || defaultQuestionSet(getMachine(machineId)?.name || "Machine");
      const q = questions[Math.floor(Math.random()*questions.length)];
      const answers = [
        {text:q.correct, ok:true},
        {text:q.wrong1, ok:false},
        {text:q.wrong2, ok:false}
      ].sort(()=>Math.random()-0.5);

      el.quizContainer.style.display = "block";
      el.quizContainer.innerHTML = `
        <div class="quizBox">
          <div style="font-weight:900;">Connaissances sur les machines</div>
          <div style="margin-top:6px;">${escHtml(q.question)}</div>
          <div class="answerGrid">
            ${answers.map((a, idx)=>`
              <button type="button" class="answerBtn" data-answer-index="${idx}" data-answer-ok="${a.ok ? "1" : "0"}">${escHtml(a.text)}</button>
            `).join("")}
          </div>
        </div>
      `;

      el.quizContainer.querySelectorAll(".answerBtn").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          const ok = btn.dataset.answerOk === "1";
          applyPendingResult(ok);
        });
      });
    }

    function hideQuiz(){
      el.quizContainer.style.display = "none";
      el.quizContainer.innerHTML = "";
      pendingResult = null;
    }

    function applyPendingResult(correct){
      if(!pendingResult) return;
      const person = findPerson(pendingResult.personId);
      if(!person) return;

      const seriesLimit = getSeriesLimit();
      if(seriesLimit.enabled && (person.results || []).length >= seriesLimit.value){
        pendingResult = null;
        hideQuiz();
        alert(`Nombre maximum de séries atteint : ${seriesLimit.value}.`);
        return;
      }

      const result = {...pendingResult.result};
      result.securityApplied = true;
      result.securityCorrect = correct;

      if(!correct){
        result.total = result.total * 0.5;
      }

      person.results.push(result);
      pendingResult = null;
      hideQuiz();
      saveState();
      renderAll();
    }

    function formatKg(n){
      return (Math.round((n||0)*10)/10).toLocaleString("fr-FR") + " kg";
    }

    function getTeamRawTotal(team){
      return team.students.reduce((sum,s)=>sum + getPersonTotal(s), 0);
    }

    function getTeamBalancedTotal(team){
      const raw = getTeamRawTotal(team);
      if(!state.balanceTeams) return raw;
      const size = Math.max(1, team.students.length);
      const maxSize = Math.max(...state.teams.map(t=>Math.max(1, t.students.length)));
      return raw * (maxSize / size);
    }

    function getTeamBalanceCoeff(team){
      if(!state.balanceTeams) return 1;
      const size = Math.max(1, team.students.length);
      const maxSize = Math.max(...state.teams.map(t=>Math.max(1, t.students.length)));
      return maxSize / size;
    }

    function renderRanking(){
      let items = [];

      if(state.mode === "individual"){
        items = getAllPeople().map(p=>{
          const total = getPersonTotal(p);
          return {
            name:p.name,
            total,
            color:"#64748b",
            animal:getCurrentAnimal(total),
            label:formatKg(total)
          };
        }).sort((a,b)=>b.total-a.total);
      } else {
        items = state.teams.map(team=>{
          const raw = getTeamRawTotal(team);
          const total = getTeamBalancedTotal(team);
          const coeff = getTeamBalanceCoeff(team);
          return {
            name:team.name,
            total,
            raw,
            coeff,
            color:team.color,
            animal:getCurrentAnimal(total),
            label:formatKg(total),
            sub: state.balanceTeams && coeff !== 1 ? `brut ${formatKg(raw)} × ${coeff.toFixed(2)}` : ""
          };
        }).sort((a,b)=>b.total-a.total);
      }

      const classTotal = getClassTotal();
      const classAnimal = getCurrentAnimal(classTotal);
      const max = Math.max(1, ...items.map(i=>i.total));
      const medals = ["🥇","🥈","🥉"];
      el.ranking.innerHTML = items.length ? items.map((item, idx)=>`
        <div class="rankItem">
          <div class="rankTop">
            <div class="rankNameWrap">
              <span class="rankBadge">${medals[idx] || `${idx+1}e`}</span>
              <div>${state.mode==="team" ? `<span class="colorDot" style="background:${item.color};"></span>` : ""}${item.name}</div>
            </div>
            <div>${item.label}</div>
          </div>
          <div class="smallText" style="margin-bottom:5px;">${item.animal.icon ? item.animal.icon + " " : ""}${item.animal.name}${item.sub ? " • " + item.sub : ""}</div>
          <div class="progress"><div style="width:${Math.min(100,(item.total/max)*100)}%;"></div></div>
        </div>
      `).join("") : `<div class="empty">Aucun résultat.</div>`;

      el.rankingSummary.innerHTML = `
        <div class="summaryChip classTotalBox">
          <div>
            <div class="smallText">Charge soulevée par la classe</div>
            <strong>${formatKg(classTotal)}</strong>
            <div class="smallText" style="margin-top:4px;">Objectif atteint : ${classAnimal.name}</div>
          </div>
          <div class="classAnimalLarge">
            ${classAnimal.count ? `<span class="count">${classAnimal.count}</span>` : ""}
            <span>${classAnimal.icon || ""}</span>
          </div>
        </div>
      `;
    }

    function renderStatsTable(){
      const tbody = el.statsTable.querySelector("tbody");
      const people = getAllPeople().slice().sort((a,b)=>getPersonTotal(b)-getPersonTotal(a));

      tbody.innerHTML = people.length ? people.map(p=>{
        const total = getPersonTotal(p);
        const animal = getCurrentAnimal(total);
        const machineNames = [...new Set((p.results||[]).map(r=>r.machineName))];
        return `
          <tr>
            <td>${state.mode === "team" ? `<span class="colorDot" style="background:${p.teamColor};"></span>${p.teamName}` : "—"}</td>
            <td>${p.name}</td>
            <td><strong>${formatKg(total)}</strong></td>
            <td>${animal.name}</td>
            <td>${(p.results||[]).length}</td>
            <td>${machineNames.length ? machineNames.join(", ") : "—"}</td>
          </tr>
        `;
      }).join("") : `<tr><td colspan="6"><div class="empty">Aucune donnée enregistrée.</div></td></tr>`;
    }

    function showPage(name){
      const pages = {
        home:el.pageHome,
        prepare:el.pagePrepare,
        challenge:el.pageChallenge
      };
      Object.values(pages).forEach(p=>p.classList.remove("active"));
      pages[name].classList.add("active");

      [el.navHome,el.navPrepare,el.navChallenge].forEach(b=>b.classList.remove("active"));
      if(name==="home") el.navHome.classList.add("active");
      if(name==="prepare") el.navPrepare.classList.add("active");
      if(name==="challenge") el.navChallenge.classList.add("active");
    }

    function getMachine(id){
      return machineCatalog.find(m=>m.id===id);
    }

    function getPersonTotal(person){
      return (person.results || []).reduce((sum,r)=>sum + (Number(r.total)||0), 0);
    }

    function getCurrentAnimal(weight){
      let current = animals[0];
      for(const a of animals){
        if(weight >= a.weight) current = a;
      }
      return current;
    }

    function getNextAnimal(weight){
      for(const a of animals){
        if(weight < a.weight) return a;
      }
      return null;
    }

    function getProgressToNext(weight){
      let lower = animals[0];
      let next = null;

      for(let i=0;i<animals.length;i++){
        if(weight >= animals[i].weight){
          lower = animals[i];
        } else {
          next = animals[i];
          break;
        }
      }

      if(!next){
        return { percent:100, text:"Objectif maximal atteint." };
      }

      const range = next.weight - lower.weight;
      const done = weight - lower.weight;
      const percent = range <= 0 ? 100 : Math.max(0, Math.min(100, (done / range) * 100));
      const remaining = next.weight - weight;

      return {
        percent,
        text:`Encore ${formatKg(remaining)} pour atteindre ${next.name}.`
      };
    }

    function esc(str){
      return String(str ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;");
    }

    function escHtml(str){
      return String(str ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;");
    }

    function escapeAttr(str){
      return String(str ?? "")
        .replaceAll("&","&amp;")
        .replaceAll('"',"&quot;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;");
    }

    function uid(){
      return Math.random().toString(36).slice(2,10);
    }

    function registerServiceWorker(){
      if("serviceWorker" in navigator){
        window.addEventListener("load", ()=>{
          navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
        });
      }
    }
  