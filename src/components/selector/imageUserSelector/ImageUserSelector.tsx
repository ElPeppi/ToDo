import { useRef } from "react";
import { fetchWithAuth } from "../../../services/authService";

export default function ProfilePhotoUploader({ selected, setSelected   }: { selected: string; setSelected: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return alert("Selecciona una imagen primero");

    // 1) pedir presigned url
    const r = await fetch("https://ckx45bj88h.execute-api.us-east-1.amazonaws.com/api/users/me/photo/upload-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({ contentType: file.type }),
    });

    const { uploadUrl, key } = await r.json();

    // 2) subir a S3
    const put = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!put.ok) throw new Error("Falló el upload a S3");

    // 3) URL pública (si tu bucket/CloudFront lo permite)
    const publicUrl = `https://todofoto.jan-productions.com/${key}`;
    console.log("Imagen subida a:", publicUrl); 
    localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user") || "{}"), photo: publicUrl }));
    const addBackend = await fetchWithAuth("/api/users/me/photo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoUrl: publicUrl }),
    });

    if (!addBackend.ok) throw new Error("Falló el update en backend");
    setSelected && setSelected(publicUrl);
    console.log("Foto de perfil actualizada con éxito");
    console.log(selected);
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" />
      <button onClick={upload}>Subir foto</button>
    </div>
  );
}