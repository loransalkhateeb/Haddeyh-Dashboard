import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';

export function UpdateBags() {
  const { id } = useParams(); 

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    sale: '',
    main_product_type: 'Bag',
    product_type: '',
    season: '',
    brandID: '',
    BagTypeID: '',
    BagVariants: [{ BagID: '', size: '', available: '', before_price: '', after_price: '' }],
    instock: '',
    img: null,
  });

  const [brands, setBrands] = useState([]);
  const [bagTypes, setBagTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:1010/product/get/brands');
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  }, []);

  const fetchBagTypes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:1010/bagtypeid/getbagtypeid');
      if (!response.ok) throw new Error('Failed to fetch bag types');
      const data = await response.json();
      setBagTypes(data);
    } catch (error) {
      console.error('Error fetching bag types:', error);
    }
  }, []);

  const fetchProductData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:1010/product/get/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product data');
      const data = await response.json();
      setProductData(data);
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBrands();
    fetchBagTypes();
    fetchProductData();
  }, [fetchBrands, fetchBagTypes, fetchProductData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...productData.BagVariants];
    updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    setProductData(prevData => ({ ...prevData, BagVariants: updatedVariants }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductData(prevData => ({ ...prevData, img: file }));
  };

  const addVariant = () => {
    setProductData(prevData => ({
      ...prevData,
      BagVariants: [...prevData.BagVariants, { BagID: '', size: '', available: '', before_price: '', after_price: '' }],
    }));
  };

  const validateData = () => {
    for (const key in productData) {
      if (key !== 'BagVariants' && !productData[key]) {
        Swal.fire({
          title: 'Error!',
          text: `${key.replace(/_/g, ' ')} is required.`,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateData()) return;

    const formDataToSend = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
        if (key !== 'BagVariants') {
            formDataToSend.append(key, value);
        }
    });

    productData.BagVariants.forEach((variant, index) => {
        formDataToSend.append(`BagVariants[${index}][BagID]`, variant.BagID);
        formDataToSend.append(`BagVariants[${index}][size]`, variant.size);
        formDataToSend.append(`BagVariants[${index}][available]`, variant.available);
        formDataToSend.append(`BagVariants[${index}][before_price]`, variant.before_price);
        formDataToSend.append(`BagVariants[${index}][after_price]`, variant.after_price);
    });

    if (productData.img) {
        formDataToSend.append('img', productData.img);
    }

    try {
        const response = await fetch(`http://localhost:1010/product/update/${id}`, {
            method: 'PUT',
            body: formDataToSend,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        Swal.fire({
            title: 'Successfully Updated!',
            text: 'The product has been updated successfully',
            icon: 'success',
            confirmButtonText: 'Ok',
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'There was a problem updating the product. Please try again.',
            icon: 'error',
            confirmButtonText: 'Ok',
        });
    }
};

  const brandOptions = useMemo(() => brands.map(brand => (
    <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
  )), [brands]);

  const bagTypeOptions = useMemo(() => bagTypes.map(type => (
    <option key={type.BagTypeID} value={type.BagTypeID}>{type.TypeName}</option>
  )), [bagTypes]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center mb-6">
          <Typography variant="h2" className="font-bold mb-4">Update Bag</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Fill in the details below to update the product.</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="img" className="block mb-1">Image</label>
              <Input id="img" type="file" onChange={handleImageChange} accept="image/*" />
            </div>
            <div>
              <label htmlFor="name" className="block mb-1">Name</label>
              <Input id="name" name="name" value={productData.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="description" className="block mb-1">Description</label>
              <Input id="description" name="description" value={productData.description} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="sale" className="block mb-1">Sale</label>
              <Input id="sale" name="sale" value={productData.sale} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="product_type" className="block mb-1">Product Type</label>
              <Input id="product_type" name="product_type" value={productData.product_type} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="season" className="block mb-1">Season</label>
              <Input id="season" name="season" value={productData.season} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="brandID" className="block mb-1">Brand</label>
              <select id="brandID" name="brandID" value={productData.brandID} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                <option value="">Select a brand</option>
                {brandOptions}
              </select>
            </div>
            <div>
              <label htmlFor="BagTypeID" className="block mb-1">Bag Type</label>
              <select id="BagTypeID" name="BagTypeID" value={productData.BagTypeID} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                <option value="">Select a bag type</option>
                {bagTypeOptions}
              </select>
            </div>
            <div>
              <label htmlFor="instock" className="block mb-1">Choose Status</label>
              <select id="instock" name="instock" value={productData.instock} onChange={handleChange} className="block w-full border p-2 rounded-lg">
                <option value="">Choose Status</option>
                <option value="yes">In Stock</option>
                <option value="no">Out of Stock</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1">Sizes</label>
              {productData.BagVariants.map((variant, index) => (
                <div key={index} className="flex flex-col mb-4 border p-4 rounded-lg">
                  <Input name="BagID" value={variant.BagID} placeholder="Bag ID" onChange={(e) => handleVariantChange(index, e)} required />
                  <Input name="size" value={variant.size} placeholder="Size" onChange={(e) => handleVariantChange(index, e)} required />
                  <Input name="available" value={variant.available} placeholder="Available (Yes/No)" onChange={(e) => handleVariantChange(index, e)} required />
                  <Input name="before_price" value={variant.before_price} placeholder="Before Price" type="number" onChange={(e) => handleVariantChange(index, e)} required />
                  <Input name="after_price" value={variant.after_price} placeholder="After Price" type="number" onChange={(e) => handleVariantChange(index, e)} required />
                </div>
              ))}
              <Button type="button" onClick={addVariant} className="mt-4">Add Variant</Button>
            </div>
          </div>
          <Button type="submit" className="w-full" color="green">Update Bag</Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateBags;
