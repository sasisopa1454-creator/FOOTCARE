// ===== VALIDATION =====
[prefix,fname,lname,birth].forEach(el=>{
  el.addEventListener("input", validateForm);
});

cid.addEventListener("input",()=>{
  cid.value=cid.value.replace(/\D/g,"");
  cidErr.textContent=cid.value.length===13?"":"เลขประจำตัวประชาชนไม่ถูกต้อง";
  validateForm();
});

phone.addEventListener("input",()=>{
  phone.value=phone.value.replace(/\D/g,"");
  phoneErr.textContent=phone.value.length===10?"":"เบอร์โทรศัพท์ไม่ถูกต้อง";
  validateForm();
});

function validateForm(){
  nextBtn.disabled=!(
    prefix.value && fname.value && lname.value &&
    cid.value.length===13 && phone.value.length===10
  );
}

nextBtn.onclick=()=>{
  page1.classList.add("d-none");
  page2.classList.remove("d-none");
  loadResults();
};

// ===== NAVIGATION =====
function back(p){
  document.querySelector(`#page${p+1}`).classList.add("d-none");
  document.querySelector(`#page${p}`).classList.remove("d-none");
}

function gotoPage3(){
  page2.classList.add("d-none");
  page3.classList.remove("d-none");
  drawChart();
}

function gotoPage4(){
  page3.classList.add("d-none");
  page4.classList.remove("d-none");
}

// ===== DATA MOCK =====
let d=[12,14,15,17,18];
let p=[22,24,25,26,28];
let r=d.map((v,i)=>v+p[i]);

function loadResults(){
  resultTable.innerHTML=d.map((_,i)=>`<tr><td>${d[i]}</td><td>${p[i]}</td><td>${r[i]}</td></tr>`).join("");
}

function drawChart(){
  new Chart(chart,{
    type:"line",
    data:{
      labels:["T1","T2","T3","T4","T5"],
      datasets:[
        {label:"Dorsi Max",data:d},
        {label:"Plantar Max",data:p},
        {label:"ROM",data:r}
      ]
    }
  });
}

// ===== SURVEY =====
const qs=[
"ใช้งานสะดวก/ใช้งานง่าย",
"ขั้นตอนการใช้ไม่ซับซ้อน",
"รู้สึกดีขึ้นหลังใช้งาน",
"ช่วยลดอาการบาดเจ็บบริเวณข้อเท้า",
"ออกแบบเหมาะสมกับผู้สูงอายุ"
];
const ops=["ดีเยี่ยม","ดี","ปานกลาง","พอใช้","ปรับปรุง"];

survey.innerHTML=qs.map((q,i)=>
`<p>${i+1}. ${q}</p>`+
ops.map(o=>`<label><input type="radio" name="q${i}" onclick="checkSurvey()"> ${o}</label>`).join(" ")
).join("<hr>");

function checkSurvey(){
  finishBtn.disabled=!qs.every((_,i)=>document.querySelector(`input[name=q${i}]:checked`));
}
fetch(APP_SCRIPT_URL, {
  method: "POST",
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(result => {
  if (result.success) {
    showModal();
  }
})
.catch(() => {
  alert("ไม่สามารถเชื่อมต่อระบบได้");
});
function enableFinishButton() {
  document.getElementById("finishBtn").disabled = false;
}
const satisfactionInputs = document.querySelectorAll(".satisfaction");

satisfactionInputs.forEach(input => {
  input.addEventListener("change", checkSatisfaction);
});

function checkSatisfaction() {
  let allAnswered = true;

  satisfactionInputs.forEach(input => {
    if (!input.checked) {
      allAnswered = false;
    }
  });

  if (allAnswered) {
    enableFinishButton();
  }
}
document
  .getElementById("finishBtn")
  .addEventListener("click", submitForm);
