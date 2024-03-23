import React, { useState } from 'react';

const EditableField = ({ title, value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(editedValue);
    setIsEditing(false);
  };

  return (
    <div>
      <label>{title}:</label>
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
        <button onClick={handleSave}>Save</button>
      ) : (
        <button onClick={handleEdit}>Edit</button>
      )}
    </div>
  );
};

export default EditableField;