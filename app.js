// Save Material Master
function saveMaterial() {
  const code = document.getElementById("matCode").value;
  const name = document.getElementById("matName").value;
  const category = document.getElementById("matCategory").value;
  const alert = parseInt(document.getElementById("matAlert").value);

  db.collection("materials").doc(code).set({
    code, name, category, alert, balance: 0
  }).then(() => alert("Material saved!"));
}

// Stock In
function stockIn() {
  const material = document.getElementById("inMaterial").value;
  const qty = parseInt(document.getElementById("inQty").value);
  const price = parseFloat(document.getElementById("inPrice").value);
  const vendor = document.getElementById("inVendor").value;
  const remark = document.getElementById("inRemark").value;
  const date = document.getElementById("inDate").value;

  db.collection("stock").add({
    type: "in", material, qty, price, vendor, remark, date
  });

  db.collection("materials").doc(material).update({
    balance: firebase.firestore.FieldValue.increment(qty)
  });
}

// Stock Out
function stockOut() {
  const material = document.getElementById("outMaterial").value;
  const qty = parseInt(document.getElementById("outQty").value);
  const price = parseFloat(document.getElementById("outPrice").value);
  const name = document.getElementById("outName").value;
  const mobile = document.getElementById("outMobile").value;
  const email = document.getElementById("outEmail").value;
  const remark = document.getElementById("outRemark").value;
  const date = document.getElementById("outDate").value;

  db.collection("stock").add({
    type: "out", material, qty, price, name, mobile, email, remark, date
  });

  db.collection("materials").doc(material).update({
    balance: firebase.firestore.FieldValue.increment(-qty)
  });
}

// Live Stock Register
db.collection("stock").orderBy("date")
  .onSnapshot(snapshot => {
    let rows = "";
    snapshot.forEach(doc => {
      const d = doc.data();
      rows += `<tr>
        <td>${d.date}</td>
        <td>${d.material}</td>
        <td>${d.type === 'in' ? d.qty : ''}</td>
        <td>${d.type === 'out' ? d.qty : ''}</td>
        <td>--</td>
        <td>${d.remark || ''}</td>
      </tr>`;
    });
    document.getElementById("stockRegister").innerHTML = rows;
  });

// Dashboard
db.collection("materials").onSnapshot(snapshot => {
  let html = "";
  snapshot.forEach(doc => {
    const d = doc.data();
    html += `<div><b>${d.name}</b> → Balance: ${d.balance}</div>`;
  });
  document.getElementById("dashboard").innerHTML = html;
});
