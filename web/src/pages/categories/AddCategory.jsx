import React from "react";
import { isInputNull } from "../../shared/functions/isInputNull";
import { isDuplicateCategory } from "../../shared/functions/isDuplicateCategory";
import PrimaryButton from "../../components/atoms/primary-button/PrimaryButton";
import * as Icon from 'react-bootstrap-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function AddCategory() {
  const [showForm, setShowForm] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");
  const [warningMessage, setWarningMessage] = React.useState(null);
  const [currentCategories, setCurrentCategories] = React.useState([]);
  const url = window.location.href

  React.useEffect(() => {
    fetch("http://localhost:3001/categories")
      .then(response => response.json())
      .then(data => {
        setCurrentCategories(data);
      });
  }, []);

  function handleNewCategoryChange(event) {
    setNewCategory(event.target.value);
  }

  function handleAddCategoryClick() {
    setShowForm(true);
  }

  function handleCancelClick() {
    setShowForm(false);
    setNewCategory("");
    setWarningMessage(null);
  }

  async function handleConfirmClick(event) {
    event.preventDefault();

    if (isInputNull(newCategory)) {
      setWarningMessage("Please enter a category name!");
    } else if (
      isDuplicateCategory(newCategory, currentCategories)
    ) {
      setWarningMessage("There is already a category with that name!");
    } else {
      let category = { id: Date.now(), name: newCategory };

      await fetch("http://localhost:3001/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(category)
      });

      setShowForm(false);
      setNewCategory("");
    }
  }

  return (
    <div className='restaurant-menu-root'>
      <div className='header'>
        <div className='title-description'>
          <h1>Cardápio</h1>
          <p>Gerencie por essa página todos os itens e categorias cadastrados no seu restaurante.</p>
        </div>
        <CopyToClipboard className='copy-button' text={url}>
          <button><Icon.ShareFill color='red' className='share-link'/></button>
        </CopyToClipboard>
      </div>
      <div className='add-category-area'>
        <PrimaryButton buttonContent='Adicionar categoria'  onClick={handleAddCategoryClick} data-testid="add-category-button"></PrimaryButton>
        {showForm && (
        <form onSubmit={handleConfirmClick}>
          <label>
            Category name:
            <input
              type="text"
              value={newCategory}
              onChange={handleNewCategoryChange}
              data-testid="add-category-input"
            />
          </label>
          <PrimaryButton buttonContent='Cancelar' type="button" onClick={handleCancelClick} data-testid="cancel-button"></PrimaryButton>
          <PrimaryButton buttonContent='Confirmar categoria' type="submit" data-testid="create-category-button"></PrimaryButton>
        </form>
      )}
      {warningMessage && <p>{warningMessage}</p>}
      </div>
    </div>
    // <div>
    //   <h1>Categories</h1>
    //   <PrimaryButton buttonContent='Adicionar categoria'  onClick={handleAddCategoryClick} data-testid="add-category-button"></PrimaryButton>
    //   {showForm && (
    //     <form onSubmit={handleConfirmClick}>
    //       <label>
    //         Category name:
    //         <input
    //           type="text"
    //           value={newCategory}
    //           onChange={handleNewCategoryChange}
    //           data-testid="add-category-input"
    //         />
    //       </label>
    //       <PrimaryButton buttonContent='Cancelar' type="button" onClick={handleCancelClick} data-testid="cancel-button"></PrimaryButton>
    //       <PrimaryButton buttonContent='Confirmar categoria' type="submit" data-testid="create-category-button"></PrimaryButton>
    //     </form>
    //   )}
    //   {warningMessage && <p>{warningMessage}</p>}
    // </div>
  );
}
