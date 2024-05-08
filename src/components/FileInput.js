import { useRef, useState, useEffect } from "react";
import placeholderImg from "../assets/preview-placeholder.png";

function FileInput({ name, value, initialPreview, onChange }) {
  const [preview, setPreview] = useState(initialPreview); // 이미지 미리보기 주소
  const inputRef = useRef();

  const handleChange = (e) => {
    const nextValue = e.target.files[0];
    onChange(name, nextValue);
  };

  const handleClearClick = () => {
    const inputNode = inputRef.current;
    if (!inputNode) return;

    inputNode.value = "";
    onChange(name, null);
  };

  useEffect(() => {
    if (!value) return;
    const nextPreview = URL.createObjectURL(value);
    setPreview(nextPreview);

    return () => {
      setPreview(initialPreview);
      URL.revokeObjectURL(nextPreview);
    };
  }, [value]);

  return (
    <div>
      <label htmlFor="fileInput">
        <img
          className="fileImg"
          src={preview || placeholderImg}
          alt="이미지 미리보기"
        />
      </label>
      <input
        type="file"
        id="fileInput"
        accept="image/png, image/jpeg"
        onChange={handleChange}
        ref={inputRef}
      />
      {value && (
        <button className="clearBtn" onClick={handleClearClick}>
          X
        </button>
      )}
    </div>
  );
}

export default FileInput;
