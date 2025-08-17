const unitsNeeded  = document.getElementById('unitsNeeded');
const unitsPerBox  = document.getElementById('unitsPerBox');
const unitsPerPack = document.getElementById('unitsPerPack');
const onlySingles  = document.getElementById('onlySingles');

const packRow        = document.getElementById('packRow');
const errorMsg       = document.getElementById('errorMsg');
const resultArea     = document.getElementById('resultArea');
const boxesRow       = document.getElementById('boxesRow');
const packsRowResult = document.getElementById('packsRowResult');
const singlesRow     = document.getElementById('singlesRow');
const boxesCount     = document.getElementById('boxesCount');
const packsCount     = document.getElementById('packsCount');
const singlesCount   = document.getElementById('singlesCount');
const mathExplanation= document.getElementById('mathExplanation');

onlySingles.addEventListener('change', () => {
  packRow.style.display = onlySingles.checked ? 'none' : 'block';
});

function showError(msg){ errorMsg.textContent = msg; resultArea.style.display='none'; }
function clearError(){ errorMsg.textContent=''; }

document.getElementById('calculateBtn').addEventListener('click', () => {
  clearError();
  const needVal = unitsNeeded.value.trim();
  const boxVal  = unitsPerBox.value.trim();
  const packVal = unitsPerPack.value.trim();
  if (needVal === '' || boxVal === '' || (!onlySingles.checked && packVal === '')){
    showError('Please fill in all boxes.'); return;
  }

  const needed = parseInt(needVal,10);
  const box    = parseInt(boxVal,10);
  const pack   = onlySingles.checked ? null : parseInt(packVal,10);
  const badNumber = Number.isNaN(needed)||Number.isNaN(box)||(pack===null?false:Number.isNaN(pack))||needed<0||box<=0||(pack===null?false:pack<=0);
  if (badNumber){ showError('Please enter valid numbers.'); return; }

  const fullBoxes = Math.floor(needed/box);
  const unitsFromBoxes = fullBoxes*box;
  const remainderAfterBoxes = needed-unitsFromBoxes;

  let fullPacks=0, unitsFromPacks=0, singles=remainderAfterBoxes;
  if(!onlySingles.checked){ fullPacks=Math.floor(remainderAfterBoxes/pack); unitsFromPacks=fullPacks*pack; singles=remainderAfterBoxes-unitsFromPacks; }

  boxesCount.textContent=fullBoxes;
  packsCount.textContent=fullPacks;
  singlesCount.textContent=singles;

  boxesRow.style.display=fullBoxes>0?'flex':'none';
  packsRowResult.style.display=onlySingles.checked?'none':(fullPacks>0?'flex':'none');
  singlesRow.style.display=singles>0?'flex':'none';

  const step1=fullBoxes>0?`1) ${fullBoxes} Boxes (${fullBoxes} x ${box} = ${unitsFromBoxes}).`:`1) No Full Boxes needed`;
  const step2=onlySingles.checked?`2) No Packs needed`:(fullPacks>0?`2) ${fullPacks} Packs (${unitsFromBoxes} + (${fullPacks} x ${pack}) = ${unitsFromBoxes+unitsFromPacks}).`:`2) No Packs needed`);
  const step3=singles>0?`3) ${singles} Singles left to pick.`:`3) No Singles needed`;
  mathExplanation.textContent=`${step1}\n${step2}\n${step3}`;

  resultArea.style.display='block';
  resultArea.setAttribute('tabindex','-1');
  resultArea.focus();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  unitsNeeded.value=''; unitsPerBox.value=''; unitsPerPack.value=''; onlySingles.checked=false; packRow.style.display='block';
  resultArea.style.display='none'; mathExplanation.textContent=''; clearError(); unitsNeeded.focus();
});

[unitsNeeded, unitsPerBox, unitsPerPack].forEach(el=>{el.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('calculateBtn').click();});});
