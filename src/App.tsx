import { useState } from "react";
import "./App.css";

function App() {
  const [uploadComplete, setUploadComplete] = useState(false);

  async function uploadImage() {
    setUploadComplete(false);
    console.log("Iniciando upload da imagem...");

    const input: any = document.getElementById("imageInput");
    const formData = new FormData();
    formData.append("file", input.files[0]);

    try {
      // Fazendo a requisição para o servidor Flask
      console.log("Fazendo a requisição para o servidor Flask");
      const response = await fetch("http://127.0.0.1:5000/uploads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.log("response não ok");
        throw new Error(`Erro no servidor: ${response.statusText}`);
      }

      // Obtendo a resposta em JSON
      const data: any = await response.json();
      console.log("Resposta do servidor:", data);

      // Verifica se a URL da imagem processada foi retornada
      if (data.image_url) {
        const imageUrl = `http://127.0.0.1:5000${data.image_url}`;
        (document as any).getElementById("processedImage").src = imageUrl;
        setUploadComplete(true);
      } else {
        throw new Error("URL da imagem não foi encontrada no JSON");
      }
    } catch (error: any) {
      console.error("Erro:", error);
      alert("Ocorreu um erro: " + error.message);
    }
  }

  return (
    <div>
      <h1>Upload de Imagem</h1>
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        onChange={uploadImage}
      />

      <div
        style={{
          display: uploadComplete ? "block" : "none",
        }}
      >
        <div style={{ marginTop: "40px", fontSize: "24px" }}>
          Imagem Processada:
        </div>
        <img
          id="processedImage"
          alt="Imagem Processada"
          style={{ maxHeight: "300px" }}
        />
      </div>
    </div>
  );
}

export default App;
