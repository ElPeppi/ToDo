import { useRef, useState } from "react";

export default function ProfilePhotoUploader() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");

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
    const publicUrl = `https://todo-profile-photos.s3.us-east-1.amazonaws.com/${key}`;
    setPhotoUrl(publicUrl);
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" />
      <button onClick={upload}>Subir foto</button>

      {photoUrl && (
        <div style={{ marginTop: 12 }}>
          <img src={photoUrl} alt="profile" style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }} />
        </div>
      )}
    </div>
  );
}