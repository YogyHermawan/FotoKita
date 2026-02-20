async function kirimData(){

    const url = "https://script.google.com/macros/s/AKfycbyL3z1rpU061RMQ6MajJtla2JoKy4z-napypFILDmqYlqm0S1Q3yi8PyChtYRF-5TbXGg/exec";

    const fileInput = document.getElementById("foto");
    const files = fileInput.files;

    if(files.length !== 3){
        alert("Harus upload tepat 3 foto!");
        return;
    }

      if(!document.getElementById("templateTerpilih").value){
        alert("Pilih template dulu ya 😊");
        return;
    }

    const data = new URLSearchParams();

    data.append("nama", document.getElementById("nama").value);
    data.append("wa", document.getElementById("wa").value);
    data.append("jumlah", document.getElementById("jumlah").value);
    data.append("bentuk", document.getElementById("bentuk").value);
    data.append("finishing", document.getElementById("finishing").value);
    data.append("teks", document.getElementById("teks").value);
    data.append("catatan", document.getElementById("catatan").value);
    data.append("template", document.getElementById("templateTerpilih").value);
    data.append("pembayaran", document.getElementById("pembayaran").value);

     setTimeout(()=>{
        loader.style.display = "none";
        alert("🎉 Pesanan berhasil dikirim!");
        document.getElementById("orderForm").reset();
        document.getElementById("preview").innerHTML = "";
        document.getElementById("harga").innerText = "Total: Rp8.000";
        btn.disabled = false;
    },2000);

    for(let i=0; i<files.length; i++){
        const base64 = await toBase64(files[i]);
        data.append("file"+i, base64.split(',')[1]);
        data.append("fileName"+i, files[i].name);
        data.append("fileType"+i, files[i].type);
    }

    fetch(url, {
        method: "POST",
        body: data
    });

    alert("Pesanan berhasil dikirim!");
}
function previewFoto(){
    const fileInput = document.getElementById("foto");
    const preview = document.getElementById("preview");

    preview.innerHTML = "";

    if(fileInput.files.length !== 3){
        alert("Harus upload tepat 3 foto!");
        fileInput.value = "";
        return;
    }

    for(let i=0; i<fileInput.files.length; i++){
        const reader = new FileReader();
        reader.onload = function(e){
            preview.innerHTML += `<img src="${e.target.result}" style="max-width:80px;margin:5px;border-radius:8px;">`;
        };
        reader.readAsDataURL(fileInput.files[i]);
    }
}

document.addEventListener("DOMContentLoaded", function(){

    const templateContainer = document.getElementById("templateContainer");

    for(let i = 1; i <= 13; i++){
        templateContainer.innerHTML += `
            <img src="images/photostrip/template${i}.png"
                 onclick="pilihTemplate(${i})"
                 id="template${i}"
                 style="width:100%;cursor:pointer;border-radius:8px;border:2px solid transparent;">
        `;
    }

});

function toBase64(file){
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = ()=> resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function pilihTemplate(id){

    document.getElementById("templateTerpilih").value = "Template " + id;

    if(!document.getElementById("templateTerpilih").value){
    alert("Pilih template dulu ya 😊");
    return;
}

    document.querySelectorAll("#templateContainer img")
        .forEach(img => img.classList.remove("selected"));

    document.getElementById("template"+id)
        .classList.add("selected");
}

function hitungHarga(){
    const jumlah = document.getElementById("jumlah");
    const harga = document.getElementById("harga");

    let total = parseInt(jumlah.value);
    harga.innerText = "Total: Rp" + total.toLocaleString("id-ID");
}

function tampilkanPembayaran(){
    const metode = document.getElementById("pembayaran").value;
    const info = document.getElementById("infoPembayaran");
    const qris = document.getElementById("qrisContainer");

    qris.style.display = "none";

    if(metode === "COD (Bayar di Tempat)"){
        info.innerHTML = "Bisa hubungi nomor berikut <b>085736073243 </b> admin FotoKita";
    }
    else if(metode === "DANA"){
        info.innerHTML = "DANA: <b>081234567890</b> a.n FotoKita";
    }
    else if(metode === "QRIS"){
        info.innerHTML = "";
        qris.style.display = "block";
    }
    else{
        info.innerHTML = "";
    }

}
