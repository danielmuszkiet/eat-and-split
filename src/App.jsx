import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -8,
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

  const showAddFriend = () => {
    setSelectedFriend(null);
    setFormOpen(!formOpen);
  };

  const handelAddFriend = (f) => {
    setFriendList((prev) => [...prev, f]);
    setFormOpen(false);
  };

  const handleSelection = (f) => {
    setSelectedFriend((cur) => (cur?.id === f.id ? null : f));
    setFormOpen(false);
  };

  const handleSplitBill = (value) => {
    setFriendList((prev) =>
      prev.map((f) => {
        if (f.id === selectedFriend.id) {
          return { ...f, balance: f.balance + value };
        } else {
          return f;
        }
      })
    );

    setSelectedFriend(null);
  };

  const handleRemoveFriend = (friend) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;
    setFriendList((prev) => prev.filter((f) => f.id !== friend.id));
    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friendList}
          onSelectFriend={handleSelection}
          selectedFriend={selectedFriend}
          onRemoveFriend={handleRemoveFriend}
        />

        <Button onClick={showAddFriend}>{formOpen ? "Close" : "Add Friend"}</Button>
      </div>
      {!selectedFriend && !formOpen && <Placeholder friendList={friendList} />}
      {formOpen && <FormAddFriend onAddFriend={handelAddFriend} />}
      {selectedFriend && (
        <FormSplitBill
          friend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function Placeholder({ friendList }) {
  return (
    <div className="placeholder">
      <h2>
        {friendList.length > 0
          ? "Select a friend to start splitting the bill!"
          : "Add a friend to you friendslist"}
      </h2>
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend, onRemoveFriend }) {
  return (
    <ul>
      {friends.map((friend) => [
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
          onRemoveFriend={onRemoveFriend}
        />,
      ])}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, onRemoveFriend, selectedFriend }) {
  const { name, balance, image } = friend;

  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      {isSelected && (
        <span className="del" onClick={() => onRemoveFriend(friend)}>
          &times;
        </span>
      )}
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p style={{ color: balance > 0 ? "green" : balance < 0 ? "red" : "" }}>
        {balance > 0
          ? `${name} owes you ${balance}€`
          : balance < 0
          ? `You owe ${name} ${Math.abs(balance)}€`
          : `You and ${name} are even`}
      </p>
      <Button onClick={() => onSelectFriend(friend)}>{isSelected ? "Close" : "Select"}</Button>
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
      <h2>Add a new friend!</h2>
      <label>👫Friend name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <label>🖼️Image URL:</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = paidByUser >= 0 ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("friend");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bill || paidByUser < 0) return;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Splitt a bill with {friend.name}</h2>

      <label>💵Bill value:</label>
      <input
        type="number"
        required
        value={bill}
        min={0}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🫵Your expenses:</label>
      <input
        type="number"
        required
        value={paidByUser}
        min={0}
        max={bill}
        onChange={(e) =>
          setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))
        }
      />

      <label>👫{friend.name} expenses:</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑Who is paying the bill?:</label>
      <select required value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>
      <button className="button">Split bill</button>
    </form>
  );
}

export default App;
