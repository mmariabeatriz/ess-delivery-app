import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { AddItemPopup } from '../../itemsComponents/AddItemPopup';
import { RestaurantMenu } from '../../RestaurantMenu';

describe('AddItemPopup', () => {
    const currentItems = [
    { id: 1, name: 'Item 1', description: 'Descrição 1', price: '10,00' },
    { id: 2, name: 'Item 2', description: 'Descrição 2', price: '20,00' },
    ];

    const onHideMock = jest.fn(() => {});

    it('should render AddItemPopup component when Adicionar button is clicked', () => {
        render(<RestaurantMenu />);

        fireEvent.click(screen.getByText('Adicionar'));

        expect(screen.getByText('Adicionar item')).toBeInTheDocument();
    });

    it('should close the modal when Cancelar button is clicked', () => {
        render(<AddItemPopup show={true} onHide={onHideMock} currentItems={currentItems}/>);

        fireEvent.click(screen.getByText('Cancelar'));

        expect(onHideMock).toHaveBeenCalled();
    });

    it('should show a warning message if any field is left blank', () => {
        render(<AddItemPopup show={true} onHide={onHideMock} currentItems={currentItems}/>);

        fireEvent.click(screen.getByTestId('addButton'));

        expect(screen.getByText('Todas as entradas devem ser preenchidas!')).toBeInTheDocument();
    });

    it('should show a warning message if the price format is invalid', () => {
        render(<AddItemPopup show={true} onHide={onHideMock} currentItems={currentItems}/>);

        fireEvent.change(screen.getByPlaceholderText('Nome'), {target: {value: 'Item Teste'}});
        fireEvent.change(screen.getByPlaceholderText('Descrição'), {target: {value: 'Descrição do item teste.'}});
        fireEvent.change(screen.getByPlaceholderText('Preço'), {target: {value: '10.50'}});

        fireEvent.click(screen.getByTestId('addButton'));
        
        expect(screen.getByText('O formato do preço não está certo! Tente começar apenas com dígitos e terminar com uma vírgula e duas casas decimais.')).toBeInTheDocument();
    });

    it('should show a warning message if an item with the same name already exists', async () => {
        render(<AddItemPopup show={true} onHide={onHideMock} currentItems={currentItems}/>);

        fireEvent.change(screen.getByPlaceholderText('Nome'), {target: {value: 'Item 1'}});
        fireEvent.change(screen.getByPlaceholderText('Descrição'), {target: {value: 'Descrição do item teste.'}});
        fireEvent.change(screen.getByPlaceholderText('Preço'), {target: {value: '10,50'}});
        fireEvent.click(screen.getByTestId('addButton'));

        expect(screen.getByText("Já existe um item com esse nome!")).toBeInTheDocument();
    });

    it('should add a new item and close the pop-up when all fields are filled correctly', async () => {
        render(<AddItemPopup show={true} onHide={onHideMock} currentItems={currentItems}/>);

        fireEvent.change(screen.getByPlaceholderText('Nome'), {target: {value: 'Item Teste'}});
        fireEvent.change(screen.getByPlaceholderText('Descrição'), {target: {value: 'Descrição do item teste.'}});
        fireEvent.change(screen.getByPlaceholderText('Preço'), {target: {value: '10,50'}});

        fireEvent.click(screen.getByTestId('addButton'));

        await waitFor(() => expect(onHideMock).toHaveBeenCalledTimes(1));
    });
});