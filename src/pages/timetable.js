import { DAYS, loadClassroom, saveStudents as persistStudents, saveSeats as persistSeats } from '../shared/classroom.js';
import { STORAGE_KEYS, readJSON } from '../shared/storageKeys.js';

var students=[],seats=[],mode="student",selected=null,moveFrom=null,week=0;

function $(id){return document.getElementById(id)}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function toast(t){var x=$("toast");x.textContent=t;x.style.display="block";setTimeout(function(){x.style.display="none"},1400)}
function load(){
 var data=loadClassroom();
 students=data.students;
 seats=data.seats;
}
function saveStudents(){persistStudents(students)}
function saveSeats(){persistSeats(seats)}
function findStudent(id){return students.find(function(s){return s.id===id})}

function renderStudents(){
 var q=$("search").value.trim().toLowerCase();
 // 학생 모드의 8칸도 자리 배치와 같은 순서를 사용합니다.
 // 따라서 교직원 모드에서 자리를 바꾸고 저장하면 첫 화면의 학생 위치도 함께 바뀝니다.
 var list=seats.map(function(id){return findStudent(id)}).filter(function(s){
  if(!s)return false;
  if(q==='')return true;
  return (String(s.id)+'번')===q || String(s.name).toLowerCase().indexOf(q)!==-1;
 });
 $("students").innerHTML=list.map(function(s){
  return '<button class="student '+(selected===s.id?"active":"")+'" data-id="'+s.id+'"><small>'+s.id+'번</small><b>'+esc(s.name)+'</b></button>';
 }).join("");
 Array.prototype.forEach.call(document.querySelectorAll(".student"),function(btn){
  btn.onclick=function(){selectStudent(Number(btn.getAttribute("data-id")))};
 });
}
function selectStudent(id){
 selected=id;renderStudents();renderSchedule();
 if(mode==="staff")$("staffStatus").textContent=findStudent(id).id+"번 "+findStudent(id).name+" 선택됨";
}
function renderSchedule(){
 var s=findStudent(selected);if(!s)return;
 $("schedule").style.display="block";$("scheduleTitle").textContent=s.id+"번 "+s.name+"의 시간표";
 $("weekText").textContent=week===0?"이번 주":(week>0?"+"+week+"주":"-"+Math.abs(week)+"주");
 $("week").innerHTML=DAYS.map(function(d,di){
  return '<div class="day"><div class="dayhead">'+d+'요일</div>'+s.subjects[di].map(function(sub,p){
   return '<div class="lesson"><small>'+(p+1)+'교시</small><b>'+esc(sub)+'</b><small>'+esc(s.rooms[di][p])+'</small></div>';
  }).join("")+'</div>';
 }).join("");
}
function showStaff(){
 mode="staff";moveFrom=null;$("studentMode").className="btn";$("staffMode").className="btn primary";
 $("staff").style.display="block";$("editor").style.display="none";
 $("staffStatus").textContent=selected===null?"학생을 선택하세요.":findStudent(selected).id+"번 "+findStudent(selected).name+" 선택됨";
 renderSeats();
}
function showStudent(){
 mode="student";moveFrom=null;$("studentMode").className="btn primary";$("staffMode").className="btn";
 $("staff").style.display="none";$("editor").style.display="none";
 // 자리 저장 후 학생 모드로 돌아오면 학생 선택 화면을 최신 자리 순서로 다시 그립니다.
 renderStudents();
 if(selected!==null) renderSchedule();
}
var seatEditMode=false;
var originalSeats=null;
var draftSeats=null;

function renderSeats(){
 var displaySeats=seatEditMode?draftSeats:seats;
 $("seatgrid").innerHTML=displaySeats.map(function(id,i){
  var st=findStudent(id);
  if(seatEditMode){
   return '<div class="seat seat-edit"><small>'+(i+1)+'번 자리</small><input class="seatNumber" data-seat="'+i+'" inputmode="numeric" autocomplete="off" placeholder="학생 번호" value="'+(st?esc(st.id):'')+'"><small class="seatPreview" data-preview="'+i+'">'+(st?esc(st.name):'빈 자리')+'</small></div>';
  }
  return '<button type="button" class="seat '+(moveFrom===i?"selected":"")+'" data-seat="'+i+'"><small>'+(i+1)+'번 자리</small><b>'+(st?esc(st.name):"빈 자리")+'</b>'+(st?'<small>'+st.id+'번</small>':"")+'</button>';
 }).join("");
 if(seatEditMode){
  Array.prototype.forEach.call(document.querySelectorAll('.seatNumber'),function(input){
   input.oninput=function(){
    var raw=input.value.trim().replace(/\s/g,'').replace(/번/g,'');
    var st=/^\d+$/.test(raw)?findStudent(Number(raw)):null;
    draftSeats[Number(input.dataset.seat)]=st?st.id:null;
    var preview=document.querySelector('[data-preview="'+input.dataset.seat+'"]');
    preview.textContent=st?st.name:(raw?'존재하지 않는 번호':'빈 자리');
   };
  });
 }else{
  Array.prototype.forEach.call(document.querySelectorAll('.seat'),function(btn){
   btn.onclick=function(){seatClick(Number(btn.getAttribute('data-seat')))};
  });
 }
}

function seatClick(i){
 if(moveFrom===null){
  if(!seats[i]){toast('학생이 있는 자리를 선택하세요.');return}
  moveFrom=i;renderSeats();toast('이동할 자리를 선택하세요.');
 }else{
  var tmp=seats[moveFrom];seats[moveFrom]=seats[i];seats[i]=tmp;
  moveFrom=null;saveSeats();renderSeats();renderStudents();toast('자리 변경 및 저장 완료');
 }
}

function startSeatEdit(){
 originalSeats=seats.slice();
 draftSeats=new Array(students.length).fill(null);
 seatEditMode=true;moveFrom=null;
 $("changeSeats").style.display='none';
 $("cancelSeats").style.display='inline-block';
 $("seatHelp").style.display='block';
 $("seatStatus").textContent='자리 변경 중 — 학생 번호를 입력하세요.';
 renderSeats();toast('모든 자리를 비웠습니다. 학생 번호를 입력하세요.');
}

function cancelSeatEdit(){
 seats=originalSeats?originalSeats.slice():seats;
 originalSeats=null;draftSeats=null;seatEditMode=false;
 $("changeSeats").style.display='inline-block';$("cancelSeats").style.display='none';
 $("seatHelp").style.display='none';$("seatStatus").textContent='총 8자리 · 학생 자리 클릭 → 이동할 자리 클릭';
 renderSeats();renderStudents();toast('자리 변경을 취소했습니다.');
}

function saveSeatEdit(){
 var next=draftSeats?draftSeats.slice():[];
 var used={};var valid=true;
 next.forEach(function(id){
  if(id!==null){if(used[id])valid=false;used[id]=true;}
 });
 if(!valid){toast('한 학생을 여러 자리에 중복 배치할 수 없습니다.');return}
 seats=next;
 saveSeats();
 renderStudents();
 // 저장 직후 localStorage에서 다시 읽어 실제 저장값을 검증
 var saved=readJSON(STORAGE_KEYS.SEATS,null);
 if(!Array.isArray(saved)||JSON.stringify(saved)!==JSON.stringify(seats)){
  toast('자리 저장에 실패했습니다. 다시 시도하세요.');return;
 }
 originalSeats=null;draftSeats=null;seatEditMode=false;
 $("changeSeats").style.display='inline-block';$("cancelSeats").style.display='none';
 $("seatHelp").style.display='none';$("seatStatus").textContent='새 자리 배치가 저장되었습니다.';
 renderSeats();toast('새로운 자리 배치를 저장했습니다.');
}
function openEditor(){
 if(selected===null){toast("먼저 학생을 선택하세요.");return}
 var s=findStudent(selected);$("editor").style.display="block";$("editId").value=s.id;$("editName").value=s.name;
 $("editgrid").innerHTML=DAYS.map(function(d,di){
  return '<div class="editday"><h3>'+d+'요일</h3>'+s.subjects[di].map(function(sub,p){
   return '<div class="field"><label>'+(p+1)+'교시</label><input class="sub" data-d="'+di+'" data-p="'+p+'" value="'+esc(sub)+'"><input class="room" data-d="'+di+'" data-p="'+p+'" value="'+esc(s.rooms[di][p])+'"></div>';
  }).join("")+'</div>';
 }).join("");
 $("editor").scrollIntoView({behavior:"smooth"});
}
function saveEditor(){
 if(selected===null)return;
 var s=findStudent(selected);
 var rawId=$("editId").value.trim().replace(/\s/g,"").replace(/번/g,"");
 if(!/^\d+$/.test(rawId)){toast("학생 번호는 숫자로 입력하세요.");return}
 var newId=Number(rawId);
 var duplicate=students.some(function(x){return x!==s && x.id===newId});
 if(duplicate){toast("이미 사용 중인 학생 번호입니다.");return}
 var oldId=s.id;
 s.id=newId;
 s.name=$("editName").value.trim()||s.name;
 Array.prototype.forEach.call(document.querySelectorAll(".sub"),function(x){s.subjects[Number(x.dataset.d)][Number(x.dataset.p)]=x.value});
 Array.prototype.forEach.call(document.querySelectorAll(".room"),function(x){s.rooms[Number(x.dataset.d)][Number(x.dataset.p)]=x.value});
 seats=seats.map(function(id){return id===oldId?newId:id});
 saveStudents();saveSeats();
 selected=newId;
 $("editor").style.display="none";renderStudents();renderSchedule();renderSeats();
 $("staffStatus").textContent=s.id+"번 "+s.name+" 수정 완료";toast("학생 번호·이름·시간표 저장 완료");
}
function openLogin(){$("loginOverlay").style.display="flex";$("loginId").value="";$("loginPw").value="";setTimeout(function(){$("loginId").focus()},50)}
function closeLogin(){$("loginOverlay").style.display="none"}
function login(){
 if(!$("loginId").value.trim()||!$("loginPw").value.trim()){toast("아이디와 비밀번호를 입력하세요.");return}
 closeLogin();showStaff();toast("교직원 모드로 이동했습니다.");
}

$("studentMode").onclick=showStudent;
$("staffMode").onclick=openLogin;
$("search").oninput=renderStudents;
$("search").onkeydown=function(e){if(e.key==="Enter"){var v=$("search").value.trim();if(/^\d+$/.test(v))$("search").value=v+"번";renderStudents();}};
$("editButton").onclick=openEditor;
$("changeSeats").onclick=startSeatEdit;
$("cancelSeats").onclick=cancelSeatEdit;
$("saveSeats").onclick=function(){if(seatEditMode)saveSeatEdit();else{saveSeats();toast("현재 자리 배치를 저장했습니다.")}};
$("cancelEdit").onclick=function(){$("editor").style.display="none"};
$("saveEdit").onclick=saveEditor;
$("loginSubmit").onclick=login;
$("loginCancel").onclick=closeLogin;
$("loginPw").onkeydown=function(e){if(e.key==="Enter")login()};
$("loginId").onkeydown=function(e){if(e.key==="Enter")$("loginPw").focus()};
$("prev").onclick=function(){week--;renderSchedule()};
$("next").onclick=function(){week++;renderSchedule()};
$("today").onclick=function(){week=0;renderSchedule()};
load();renderStudents();
