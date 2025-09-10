document.getElementById("healthForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());
  data.disease = formData.getAll("disease"); // multiple checkbox handle

  try {
    const res = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    const msg = document.getElementById("successMessage");

    if (result.success) {
      msg.innerHTML = "✅ आपका डेटा सफलतापूर्वक सेव हो गया!<br>🙏 धन्यवाद।<br>📞 हमारी टीम जल्द ही संपर्क करेगी।";
      msg.style.display = "block";
      msg.style.color = "green";
      this.reset();
    } else {
      msg.innerHTML = "❌ " + (result.message || "सबमिट करने में समस्या आई।");
      msg.style.display = "block";
      msg.style.color = "red";
    }
  } catch (error) {
    alert("❌ Server से कनेक्ट नहीं हो पाया।");
    console.error(error);
  }
});
