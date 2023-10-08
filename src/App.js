import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./App.css";
const AsyncHttpRequest = require("async-http-request-components");

Modal.setAppElement("#root");

function App() {
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState({ userName: "", field: "" });
  const [editData, setEditData] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await AsyncHttpRequest.get(
        "https://64acebf29edb4181202ff4a2.mockapi.io/submit/submit"
      );
      const jsonData = response.data;
      setData(jsonData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddData = async () => {
    if (newData.userName && newData.field) {
      try {
        await AsyncHttpRequest.post(
          "https://64acebf29edb4181202ff4a2.mockapi.io/submit/submit",
          newData
        );
        fetchData();
        // setNewData({ userName: "", field: "" });
        closeModal();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEditData = async () => {
    if (editData) {
      try {
        await AsyncHttpRequest.put(
          `https://64acebf29edb4181202ff4a2.mockapi.io/submit/submit/${editData.id}`,
          editData
        );
        fetchData();
        setEditData(null);
        closeModal();
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleEditButtonClick = (item) => {
    setEditData(item);
    setModalIsOpen(true);
  };

  const handleDeleteData = async (id) => {
    try {
      await AsyncHttpRequest.delete(
        `https://64acebf29edb4181202ff4a2.mockapi.io/submit/submit/${id}`
      );
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewData({ userName: "", field: "" });
    setEditData({});
  };

  return (
    <div className="App">
      <h1>Hello World</h1>
      <button onClick={openModal}>Add Data</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add/Edit Data"
      >
        <h2>{Object.keys(editData).length > 0 ? "Edit Data" : "Add Data"}</h2>
        <input
          type="text"
          placeholder="User Name"
          value={
            Object.keys(editData).length > 0
              ? editData.userName
              : newData.userName
          }
          onChange={(e) =>
            Object.keys(editData).length > 0
              ? setEditData({ ...editData, userName: e.target.value })
              : setNewData({ ...newData, userName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Field"
          value={
            Object.keys(editData).length > 0 ? editData.field : newData.field
          }
          onChange={(e) =>
            Object.keys(editData).length > 0
              ? setEditData({ ...editData, field: e.target.value })
              : setNewData({ ...newData, field: e.target.value })
          }
        />
        {Object.keys(editData).length > 0 ? (
          <button onClick={handleEditData}>Save</button>
        ) : (
          <button onClick={handleAddData}>Add</button>
        )}
        <button onClick={closeModal}>Close</button>
      </Modal>

      <h2>Get Result</h2>
      <ul>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item) => (
            <li className="flex" key={item.id}>
              <div>
                User Name: {item.userName}, Field: {item.field}
              </div>
              <div>
                <button onClick={() => handleEditButtonClick(item)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteData(item.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>No data available</li>
        )}
      </ul>
    </div>
  );
}

export default App;
