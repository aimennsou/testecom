'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { RotateCcw } from 'lucide-react';

interface Category {
  id: number;
  nom: string;
  description: string;
  parentId?: number; 
}

interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;
  quantiteStock: number;
  categoryy: number; 
}

interface CartItem {
  id: number;
  nom: string;
  produitId: number;
  prixUnitaire: number;
  quantite: number;
}

export default function Home() {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null); 
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productCategoryId, setProductCategoryId] = useState<number |undefined>(undefined); 
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchCartItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categorie');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/produit');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/panier');
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      } else {
        console.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleCategorySubmit = async () => {
    try {
      const response = await fetch('/api/categorie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: categoryName,
          description: categoryDescription,
          parentId: parentCategoryId, 
        }),
      });

      if (response.ok) {
        console.log('Category created successfully');
        toast({
          title: 'Catégorie ajoutée',
        });
        fetchCategories();
      } else {
        console.error('Failed to create category');
        toast({
          title: "Erreur lors de l'ajout de la catégorie",
        });
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Erreur lors de l'ajout de la catégorie",
      });
    }
  };

  const handleCategoryModify = async (requestBody: { id: number; nom: string; description: string; parentCategoryId?: any }) => {
    try {
      const response = await fetch(`/api/categorie`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log('Category updated successfully');
        toast({
          title: 'Catégorie modifiée',
        });
        fetchCategories(); 
        setEditCategoryId(null); 
      } else {
        console.error('Failed to update category');
        toast({
          title: 'Erreur lors de la modification de la catégorie',
        });
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Erreur',
      });
    }
  };

  const handleCategoryDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/categorie`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        console.log('Category deleted successfully');
        toast({
          title: 'Catégorie supprimée',
        });
        fetchCategories();
      } else {
        console.error('Failed to delete category');
        toast({
          title: 'Erreur',
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Erreur',
      });
    }
  };

  const handleProductSubmit = async () => {
    try {
      const response = await fetch('/api/produit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: productName,
          description: productDescription,
          prix: parseFloat(productPrice),
          quantiteStock: parseInt(productStock),
          categoryy: productCategoryId, 
        }),
      });

      if (response.ok) {
        console.log('Product created successfully');
        toast({
          title: 'Produit ajouté',
        });
        fetchProducts();
      } else {
        console.error('Failed to create product');
        toast({
          title: "Erreur lors de l'ajout du produit",
        });
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Erreur lors de l'ajout du produit",
      });
    }
  };

  const handleProductModify = async (requestBody: {
    id: number;
    nom: string;
    description: string;
    prix: number;
    quantiteStock: number;
    categoryId: number |undefined;
  }) => {
    try {
      const response = await fetch(`/api/produit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log('Product updated successfully');
        toast({
          title: 'Produit modifié',
        });
        fetchProducts();
      } else {
        console.error('Failed to update product');
        toast({
          title: 'Erreur',
        });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Erreur',
      });
    }
  };

  const handleProductDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/produit`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        console.log('Product deleted successfully');
        toast({
          title: 'Produit supprimé',
        });
        fetchProducts();
      } else {
        console.error('Failed to delete product');
        toast({
          title: 'Erreur',
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Erreur',
      });
    }
  };

  const handleAddToCart = async (productId: number,prixUnitaire:number) => {
    try {
      const response = await fetch(`/api/panier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ produitId: productId, quantite: 1 , prixUnitaire }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Product added to cart:', data);
        toast({
          title: 'Produit ajouté au panier',
        });
        fetchCartItems(); 
        fetchProducts();  
        fetchCartItems();
      } else {
        console.error('Failed to add product to cart');
        toast({
          title: 'Erreur',
        });
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast({
        title: 'Erreur',
      });
    }
  };
  
  const handleRemoveFromCart = async (itemId: number) => {
    try {
      const response = await fetch(`/api/panier`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
      });
  
      if (response.ok) {
        console.log('Item removed from cart successfully');
        toast({
          title: 'Produit retiré du panier',
        });
        fetchCartItems(); 
      } else {
        console.error('Failed to remove item from cart');
        toast({
          title: 'Erreur',
        });
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: 'Erreur',
      });
    }
  };

  const handleResetDatabase = async () => {
    try {
      const response = await fetch('/api/reset', {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Database reset successfully');
        toast({
          title: 'reset',
        });
        fetchCategories(); 
        fetchProducts();  
        fetchCartItems();

      } else {
        console.error('Failed to reset database');

      }
    } catch (error) {
      console.error('Error resetting database:', error);

    }
  };


  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.prixUnitaire * item.quantite;
    }, 0);
  };

  return (
    <div className="flex flex-row space-x-8 items-start  mt-8">
    
<div className="flex flex-col gap-4 mx-4" >
<Button className='bg-red-400 border border-red-600 hover:bg-red-500' onClick={handleResetDatabase}>
      <RotateCcw className='w-5 h-5 text-red-600' />
    </Button>
<div className="w-full max-w-3xl p-4 bg-white border border-gray-600 shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Ajouter une catégorie</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <Label>Nom de la catégorie</Label>
            <Input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label>Description de la catégorie</Label>
            <Input
              type="text"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label>Catégorie parente</Label>
            <select
                  value={parentCategoryId || ''}
                  onChange={(e) => setParentCategoryId(parseInt(e.target.value))}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
          </div>

          <Button className="bg-blue-400 hover:bg-blue-600" onClick={handleCategorySubmit}>Ajouter Catégorie</Button>
        </div>
      </div>

      <div className="w-full max-w-3xl p-4 bg-white border border-gray-600 shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Ajouter un produit</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-1">
            <Label>Nom du produit</Label>
            <Input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label>Description du produit</Label>
            <Input
              type="text"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label>Prix du produit</Label>
            <Input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label>Quantité en stock</Label>
            <Input
              type="number"
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <Label>Catégorie du produit</Label>
            <select
                  value={productCategoryId || ''}
                  onChange={(e) => setProductCategoryId(parseInt(e.target.value))}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
          </div>
          <Button className="bg-blue-400 hover:bg-blue-600" onClick={handleProductSubmit}>Ajouter Produit</Button>
        </div>
      </div>

</div>
   



      <div className="w-full h-full max-w-3xl p-4 bg-white border border-gray-600 shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Liste des catégories</h2>
        {categories.map((category) => (
          <Card key={category.id}>
          <CardHeader>
            <CardTitle>{category.nom}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{category.description}</CardDescription>
           
              <CardDescription>Parent Category: {category.parentId}</CardDescription>
          
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger>
                <Button className='mr-2'>Modifier</Button>
              </DialogTrigger>
              <DialogContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1">
                    <Label>Nom de la catégorie</Label>
                    <Input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Label>Description de la catégorie</Label>
                    <Input
                      type="text"
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Label>Catégorie parente</Label>
                    <select
                      value={parentCategoryId || ''}
                      onChange={(e) => setParentCategoryId(parseInt(e.target.value))}
                    >
                      <option value="">Sélectionner une catégorie parente (optionnel)</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    className="bg-blue-400 hover:bg-blue-600"
                    onClick={() => handleCategoryModify({
                      id: category.id,
                      nom: categoryName,
                      description: categoryDescription,
                      parentCategoryId,
                    })}
                  >
                    Enregistrer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="bg-red-400 hover:bg-red-600" onClick={() => handleCategoryDelete(category.id)}>Supprimer</Button>
          </CardFooter>
        </Card>
        
        ))}
      </div>

      <div className="w-full h-full max-w-3xl p-4 bg-white border border-gray-600 shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Liste des produits</h2>
        {products.map((product) => (
      <Card key={product.id}>
      <CardHeader>
        <CardTitle>{product.nom}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{product.description}</CardDescription>
        <CardDescription>Prix: {product.prix}</CardDescription>
        <CardDescription>Quantité en stock: {product.quantiteStock}</CardDescription>
        <CardDescription>Catégorie: {product.categoryy}</CardDescription>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger>
            <Button className='mr-2'>Modifier</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                <Label>Nom du produit</Label>
                <Input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <Label>Description du produit</Label>
                <Input
                  type="text"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <Label>Prix du produit</Label>
                <Input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <Label>Quantité en stock</Label>
                <Input
                  type="number"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <Label>Catégorie du produit</Label>
                <select
                  value={productCategoryId || ''}
                  onChange={(e) => setProductCategoryId(parseInt(e.target.value))}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nom}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                className="bg-blue-400 hover:bg-blue-600"
                onClick={() => handleProductModify({
                  id: product.id,
                  nom: productName,
                  description: productDescription,
                  prix: parseFloat(productPrice),
                  quantiteStock: parseInt(productStock),
                  categoryId: productCategoryId,
                })}
              >
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button className='bg-green-400 mr-2 hover:bg-green-600' onClick={() => handleAddToCart(product.id , product.prix)}>Ajouter au panier</Button>
        <Button className='bg-red-400 hover:bg-red-600' onClick={() => handleProductDelete(product.id)}>Supprimer</Button>
      </CardFooter>
    </Card>
    
        ))}
      </div>

      <div className="w-full  max-w-3xl p-4 bg-white border border-gray-600 shadow rounded-lg">
  <h2 className="text-2xl font-semibold mb-4">Panier</h2>
  <div className="flex flex-col space-y-4">
    {cartItems.map((item) => (
      <Card key={item.id}>
        <CardHeader>
          <CardTitle> Id Produit:{item.produitId}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Prix unitaire: {item.prixUnitaire}</CardDescription>
          <CardDescription>Quantité: {item.quantite}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button className="bg-red-400 hover:bg-red-600" onClick={() => handleRemoveFromCart(item.id)}>Retirer du panier</Button>
        </CardFooter>
      </Card>
    ))}
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">Total du panier:</h3>
      <span className="text-xl font-semibold">{calculateCartTotal()} €</span>
    </div>
  </div>
</div>


    </div>
  );
}
