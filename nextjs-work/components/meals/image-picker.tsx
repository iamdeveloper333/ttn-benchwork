"use client";

import { ChangeEvent, RefObject, useRef, useState } from "react";
import Image from "next/image";

import classes from "./image-picker.module.css";

interface ImagePickerProps {
  label: string;
  name: string;
}
export default function ImagePicker({ label, name }: ImagePickerProps) {
  const [pickedImage, setPickedImage] = useState<string | null>();
  const imageInput = useRef<HTMLInputElement>() as RefObject<HTMLInputElement>;

  function handlePickClick() {
    imageInput?.current?.click();
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setPickedImage(undefined);
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      const result = fileReader.result;

      setPickedImage(result as any);
    };

    fileReader.readAsDataURL(file);
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user."
              fill
            />
          )}
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          ref={imageInput}
          onChange={handleImageChange}
          required
        />
        <button
          className={classes.button}
          type="button"
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
