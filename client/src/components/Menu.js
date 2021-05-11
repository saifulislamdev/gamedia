import React from 'react'

const MenuStyle = {
    color: "#E84637",
    backgroundColor: "#0C1221",
    padding: "0 10 5 5",
    fontWeight: "bolder",
};
export const Menu = () => {
    return (
    
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action" style={MenuStyle}>Call of duty</a>
                <a href="#" class="list-group-item list-group-item-action" style={MenuStyle}>League of Legends</a>
                <a href="#" class="list-group-item list-group-item-action" style={MenuStyle}>Fortnite</a>
                <a href="#" class="list-group-item list-group-item-action" style={MenuStyle}>Apex</a>
                <a href="#" class="list-group-item list-group-item-action" style={MenuStyle}>Runescape</a>
            </div>
       
    )
}

export default Menu;