import React, { useState, useEffect } from "react";
import axios from "axios";

const BasUrl = "https://crud-api.reed-barger.now.sh/users";

const styles = {
  formSection: {
    marginTop: "3em",
    display: "flex",
    justifyContent: "center"
  }
};

function App() {
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState({ username: "", email: "" });

  useEffect(() => {
    axios.get(BasUrl).then(res => {
      console.log("USERS FETCHED", res);
      setUsers(res.data);
    });
    // setTimeout(() => setUsers(initialUsers), 1000);
  }, []);

  function handleChange(event) {
    event.persist();
    setUser(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const userId = users.findIndex(u => u.id === user.id);
    const userExists = userId > -1;
    // if user exists, update it
    if (userExists) {
      axios.put(`${BasUrl}/${user.id}`, user).then(res => {
        console.log("USER UPDATED", res);
        const updatedUsers = users.map(u => {
          return u.id === user.id ? user : u;
        });
        setUsers(updatedUsers);
      });
      // if user doesn't exist, create it
    } else {
      const newUser = { ...user, id: Date.now() };
      axios.post(BasUrl, newUser).then(res => {
        console.log("USER CREATED", res);
        setUsers([...users, newUser]);
      });
    }
    setUser({ username: "", email: "" });
  }

  function clearUser() {
    setUser({ username: "", email: "" });
  }

  function deleteUser(user) {
    axios.delete(`${BasUrl}/${user.id}`).then(res => {
      console.log("USER DELETED", res);
      setUsers(users.filter(u => u.id !== user.id));
    });
  }

  return (
    <div className="container">
      <h1 className="text-center bg-primary p-3">CRUD App</h1>
      <div style={styles.formSection}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-controle"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={user.username}
            />
          </div>
          <div className="form-group">
            <input
              className="form-controle"
              name="email"
              placeholder="email"
              onChange={handleChange}
              value={user.email}
            />
          </div>

          <div>
            <button className="btn btn-primary btn-lg btn-block" type="submit">
              Submit
            </button>
          </div>

          <br />

          <hr />

          <div>
            <button onClick={clearUser} className="btn btn-primary btn-lg btn-block" type="button">
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
