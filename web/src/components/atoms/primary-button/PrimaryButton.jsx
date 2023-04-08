import { Button } from 'react-bootstrap';
import './PrimaryButton.css'

function PrimaryButton(props) {
  return (
    <div>
      <Button onClick={props.onClick} className='primary-button'>{props.buttonContent}</Button>
    </div>
  )
}

export default PrimaryButton






