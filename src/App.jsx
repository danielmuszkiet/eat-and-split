import { use, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friendList, setFriendList] = useState(initialFriends);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const showAddFriend = () => setFormOpen(!formOpen);

  const handelAddFriend = (f) => {
    setFriendList((prev) => [...prev, f]);
    setFormOpen(false);
  };

  return (
    <div className="app">
      <div className="sidebar">
        {!formOpen && <FriendsList friends={friendList} />}
        {formOpen && <FormAddFriend onAddFriend={handelAddFriend} />}
        <Button onClick={showAddFriend}>
          {formOpen ? "Close" : "Add Friend"}
        </Button>
      </div>
      <div className="sidebar">
        <FormSplitBill friend={selectedFriend} />
      </div>
    </div>
  );
}

function FriendsList({ friends }) {
  return (
    <ul>
      {friends.map((friend) => [<Friend friend={friend} key={friend.id} />])}
    </ul>
  );
}

function Friend({ friend }) {
  const { name, balance, image } = friend;
  return (
    <li>
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p style={{ color: balance > 0 ? "green" : balance < 0 ? "red" : "" }}>
        {balance > 0
          ? `${name} owes you ${balance}€`
          : balance < 0
          ? `You owe ${name} ${Math.abs(balance)}€`
          : `You and ${name} are even`}
      </p>
      <Button>Select</Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=");
  console.log("test");

  function onFormSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = {
      name,
      image: image + Math.random(),
      id: crypto.randomUUID(),
      balance: 0,
    };

    onAddFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={onFormSubmit}>
      <label>👫Friend name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label>🖼️Image URL:</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend }) {
  return (
    <form className="form-split-bill">
      <h2>Splitt a bill with {friend?.name ? friend?.name : ""}</h2>

      <label>💵Bill value:</label>
      <input type="text" />

      <label>🫵Your expenses:</label>
      <input type="text" />

      <label>👫name expenses:</label>
      <input type="text" disabled value="123" />

      <label>🤑Who is paying the bill?:</label>
      <select>
        <option value="user">You</option>
        <option value="friend">Name</option>
      </select>
      <button className="button">Split bill</button>
    </form>
  );
}

export default App;
