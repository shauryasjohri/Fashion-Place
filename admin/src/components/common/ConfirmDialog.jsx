import { Modal, Button } from 'react-bootstrap'

export default function ConfirmDialog({
  show,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmLabel = 'Confirm',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
        {message}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
      </Modal.Footer>
    </Modal>
  )
}
