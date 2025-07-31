import { use } from "react";
import { useEffect, useState } from "react";

export default function UsersList() {
  const [users, setUsers] = useState([]);


  //calls the route in the backend that grabs all user data from the database
  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  //lists the user data in a basic html list
    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(user => <li key={user.id}>{user.username}</li>)}
            </ul>
        </div>
    );
}