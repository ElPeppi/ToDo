import { useRef, useState } from "react";
import { fetchWithAuth } from "../../../services/authService";
interface Props {
    photoUrl?: string;
  }
export default function ProfilePhotoUploader({ photoUrl }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoUrlState, setPhotoUrlState] = useState<string>(photoUrl || "");

  
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
      setPhotoUrlState(publicUrl);

    const addBackend = await fetchWithAuth("/users/me/photo", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoUrl: publicUrl }),
    });
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" />
      <button onClick={upload}>Subir foto</button>

      {photoUrlState && (
        <div style={{ marginTop: 12 }}>
          <img src={photoUrlState} alt="profile" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }} />
        </div>
      )}
    </div>
  );
}