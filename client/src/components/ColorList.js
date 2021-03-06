import React, { useState } from "react";

import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [addColor, setAddColor] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        const updatedArray = colors.map(color => {
          if (color.id === res.data.id) {
            return colorToEdit;
          } else {
            return color;
          }
        });
        updateColors(updatedArray);
        setEditing(false);
        setColorToEdit(initialColor);
      })
      .catch(err => console.log("Put request error: ", err));
  };

  const deleteColor = colorId => {
    setEditing(false);
    axiosWithAuth()
      .delete(`/colors/${colorId}`)
      .then(res => {
        const filteredArray = colors.filter(color => color.id !== res.data);
        updateColors(filteredArray);
      })

      .catch(err => console.log("Delete request error: ", err));
  };

  const saveAddColor = e => {
    const newColor = {
      ...addColor,
      id: colors.length + 1
    };
    e.preventDefault();
    axiosWithAuth()
      .post("/colors", newColor)
      .then(res => {
        updateColors(res.data);
        setAddColor(initialColor);
      })
      .catch(err => console.log("Color post request error: ", err));
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteColor(color.id);
                }}
              >
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      {/* stretch - build another form here to add a color */}
      <form onSubmit={saveAddColor}>
        <legend>add color</legend>
        <label>
          color name:
          <input
            onChange={e => setAddColor({ ...addColor, color: e.target.value })}
            value={addColor.color}
          />
        </label>
        <label>
          hex code:
          <input
            onChange={e =>
              setAddColor({
                ...addColor,
                code: { hex: e.target.value }
              })
            }
            value={addColor.code.hex}
          />
        </label>
        <div className="button-row">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ColorList;
