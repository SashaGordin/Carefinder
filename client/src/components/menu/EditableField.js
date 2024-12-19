import React, { useState } from 'react';

const EditableField = ({ title, value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);
  const [originalValue, setOriginalValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalValue(editedValue);
  };

  const handleSave = () => {
    onChange(editedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValue(originalValue);
    setIsEditing(false);
  };

  return (
    <div>
      <label>{title}:</label>&nbsp;
      {isEditing ? (
        <input
          type="text"
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
        />
      ) : (
        <span>{value}</span>
      )}
      {isEditing ? (
        <>
          <button onClick={handleSave}>Save</button>&nbsp;
          <button className="cancelButton" onClick={handleCancel}>
            Cancel
          </button>
        </>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
};

export default EditableField;
