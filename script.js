const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwDpQBEGJlOqTjjJjELfdkxVEvF0bnqwtna43G2JS4nNN1eQE0Ui6yCc-s44UEDjsqE/exec";

/* ===== MOCK DATA ===== */
const d=[12,14,15,16,18];
const p=[22,24,25,27,28];
const r=d.map((v,i)=>v+p[i]);

/* ===== AGE ===== */
function calcAge(){
  if(!birth.value) return 0;
  const b=new Date(birth.value);
  const t=new Date();
  let age=t.getFullYear()-b.getFullYear();
  if (t < new Date(t.getFullYear(), b.getMonth(), b.getDate())) age--;
  ageShow.textContent="อายุ "+age+" ปี";
  return age;
}
birth.onchange = calcAge;

/* ===== VALIDATION ===== */
[prefix,fname,lname].forEach(el=>{
  el.oninput = validate;
});

cid.oninput=()=>{
  cid.value=cid.value.replace(/\D/g,"");
  cidErr.textContent=cid.value.length===13?"":"เลขประจำตัวประชาชนไม่ถูกต้อง";
  validate();
};

phone.oninput=()=>{
  phone.value=phone.value.replace(/\D/g,"");
  phoneErr.textContent=phone.value.length===10?"":"เบอร์โทรศัพท์ไม่ถูกต้อง";
  validate();
};

function validate(){
  nextBtn.disabled = !(
    prefix.value &&
    fname.value &&
    lname.value &&
    cid.value.length===13 &&
    phone.value.length===10
  );
}

/* ===== PAGE NAV ===== */
nextBtn.onclick=()=>{
  page1.classList.add("d-none");
  page2.classList.remove("d-none");

  resultTable.innerHTML=d.map((_,i)=>
    `<tr><td>${d[i]}</td><td>${p[i]}</td><td>${r[i]}</td></tr>`
  ).join("");
};

function back(p){
  document.querySelector(`#page${p+1}`).classList.add("d-none");
  document.querySelector(`#page${p}`).classList.remove("d-none");
}

function gotoPage3(){
  page2.classList.add("d-none");
  page3.classList.remove("d-none");

  new Chart(chart,{
    type:"line",
    data:{
      labels:["T1","T2","T3","T4","T5"],
      datasets:[
        {label:"Dorsi",data:d},
        {label:"Plantar",data:p},
        {label:"ROM",data:r}
      ]
    }
  });
}

function gotoPage4(){
  page3.classList.add("d-none");
  page4.classList.remove("d-none");
}

/* ===== SURVEY ===== */
const qs=[
  "ใช้งานง่าย",
  "ขั้นตอนไม่ซับซ้อน",
  "รู้สึกดีขึ้น",
  "ลดอาการบาดเจ็บ",
  "เหมาะกับผู้สูงอายุ"
];
const ops=["ดีเยี่ยม","ดี","ปานกลาง","พอใช้","ปรับปรุง"];

survey.innerHTML=qs.map((q,i)=>
  `<p>${i+1}. ${q}</p>`+
  ops.map(o=>`<label>
    <input type="radio" name="q${i}" value="${o}" onchange="check()"> ${o}
  </label>`).join(" ")
).join("<hr>");

function check(){
  finishBtn.disabled=!qs.every((_,i)=>
    document.querySelector(`input[name=q${i}]:checked`)
  );
}

/* ===== SUBMIT ===== */
finishBtn.onclick=()=>{
  fetch(APP_SCRIPT_URL,{
    method:"POST",
    body:JSON.stringify({
      prefix:prefix.value,
      firstName:fname.value,
      lastName:lname.value,
      age:calcAge(),
      idcard:cid.value,
      phone:phone.value,
      results:d.map((_,i)=>({
        dorsi:d[i],
        plantar:p[i],
        rom:r[i]
      })),
      satisfaction:qs.map((_,i)=>
        document.querySelector(`input[name=q${i}]:checked`).value
      )
    })
  })
  .then(r=>r.json())
  .then(r=>{
    if(r.success){
      successModal.style.display="block";
    }else{
      alert("บันทึกไม่สำเร็จ");
    }
  })
  .catch(()=>{
    alert("ไม่สามารถเชื่อมต่อ Google Sheets");
  });
};

/* ===== MODAL ===== */
function closeModal(){
  successModal.style.display="none";
  location.reload();
}
