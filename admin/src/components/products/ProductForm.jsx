import { useState, useEffect } from 'react'
import { Modal, Button, Form, Spinner } from 'react-bootstrap'

export default function ProductForm({ show, onHide, onSubmit, product, categories = [], loading }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    inStock: 'true',
    categories: '',
    sizes: '',
    colors: '',
  })

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || '',
        description: product.description || '',
        image: product.image || '',
        price: product.price ?? '',
        inStock: product.inStock != null ? String(product.inStock) : 'true',
        categories: Array.isArray(product.categories) ? product.categories.join(', ') : '',
        sizes: Array.isArray(product.sizes || product.size) ? (product.sizes || product.size).join(', ') : '',
        colors: Array.isArray(product.colors || product.color) ? (product.colors || product.color).join(', ') : '',
      })
    } else {
      setForm({ title: '', description: '', image: '', price: '', inStock: 'true', categories: '', sizes: '', colors: '' })
    }
  }, [product])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      price: parseFloat(form.price),
      inStock: form.inStock === 'true',
      categories: form.categories ? form.categories.split(',').map(s => s.trim()).filter(Boolean) : [],
      size: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
      color: form.colors ? form.colors.split(',').map(s => s.trim()).filter(Boolean) : [],
    })
  }

  const imageUrl = form.image

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{product ? 'Edit Product' : 'New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" value={form.title} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>In Stock</Form.Label>
                <Form.Select name="inStock" value={form.inStock} onChange={handleChange}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-12">
              <Form.Group>
                <Form.Label>Image URL</Form.Label>
                <Form.Control name="image" value={form.image} onChange={handleChange} required />
              </Form.Group>
            </div>
            {imageUrl && (
              <div className="col-12">
                <img src={imageUrl} alt="Preview" className="img-fluid rounded" style={{ maxHeight: 200 }} />
              </div>
            )}
            <div className="col-12">
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} name="description" value={form.description} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Categories (comma-separated)</Form.Label>
                <Form.Control name="categories" value={form.categories} onChange={handleChange} placeholder="e.g. men, women" />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Sizes (comma-separated)</Form.Label>
                <Form.Control name="sizes" value={form.sizes} onChange={handleChange} placeholder="e.g. S, M, L" />
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Colors (comma-separated)</Form.Label>
                <Form.Control name="colors" value={form.colors} onChange={handleChange} placeholder="e.g. Red, Blue" />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : (product ? 'Update' : 'Create')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
