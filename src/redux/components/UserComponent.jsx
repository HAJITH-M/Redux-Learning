import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, fetchAllUsers} from '../features/userSlice/userSlice';

function UserComponent() {
  const dispatch = useDispatch();
  const { entities, loading, error } = useSelector(state => state.users);

  const getUser = () => {
    dispatch(fetchUserById(1)); // Fetch user with ID = 1
    
  };

  return (
    <div>
    <button onClick={() => dispatch(fetchAllUsers())}>Fetch All Users</button>

      <button onClick={getUser}>Fetch User #1</button>
      {loading === 'loading' && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {entities.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default UserComponent;
