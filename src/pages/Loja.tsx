import { useState, useEffect } from 'react';
import { ShoppingCart, Users, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Money } from '@/components/ui/money';
import { KitCustomizer } from '@/components/loja/kit-customizer';
import { CheckoutForm } from '@/components/loja/checkout-form';
import { useKitsStore } from '@/stores/useKitsStore';
import { Kit } from '@/domain/types';

interface CartItem {
  kit: Kit;
  quantidade: number;
  customizations: {
    trocas: Array<{ itemOriginal: string; itemNovo: string; diferenca: number }>;
    extras: Array<{ itemId: string; quantidade: number; preco: number }>;
  };
  precoFinal: number;
}

export default function Loja() {
  const { kits, loadingKits, loadKits } = useKitsStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    loadKits();
  }, [loadKits]);

  const handleAddToCart = (cartItem: CartItem) => {
    setCart(prev => [...prev, cartItem]);
    setSelectedKit(null);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const getTotalCart = () => {
    return cart.reduce((total, item) => total + (item.precoFinal * item.quantidade), 0);
  };

  if (loadingKits) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showCheckout) {
    return <CheckoutForm cart={cart} onBack={() => setShowCheckout(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">Kit Churras Pro</h1>
        <p className="text-xl text-muted-foreground">
          Os melhores kits de churrasco, prontos para entregar!
        </p>
      </div>

      {/* Kits Disponíveis */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {kits.filter(kit => kit.ativo).map((kit) => (
          <Card key={kit.id} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="relative">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-primary">{kit.nome}</CardTitle>
                  <CardDescription className="text-base mt-2">{kit.descricao}</CardDescription>
                </div>
                <Badge variant="outline" className="shrink-0 ml-4">
                  <Users className="h-3 w-3 mr-1" />
                  {kit.nome.includes('Abraãozinho') ? '7 pessoas' : '12 pessoas'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-4">
              <div className="text-3xl font-bold text-primary">
                <Money value={kit.preco} />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Incluso no Kit:
                </h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div>• Contra Filé Grill {kit.nome.includes('Lopes') ? '(2kg)' : '(1kg)'}</div>
                  <div>• Drumet na Mostarda {kit.nome.includes('Lopes') ? '(2kg)' : '(1kg)'}</div>
                  <div>• Linguiça Toscana {kit.nome.includes('Lopes') ? '(2kg)' : '(1kg)'}</div>
                  <div>• Picanha Suína</div>
                  <div>• Pão de Alho</div>
                  <div>• Sal Grosso {kit.nome.includes('Lopes') ? '(2x)' : ''}</div>
                  <div>• Farofa</div>
                  <div>• Carvão</div>
                  <div>• Acendedor</div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm text-center font-medium text-muted-foreground">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Trocas permitidas • Itens extras disponíveis
                </p>
              </div>
            </CardContent>

            <CardFooter className="relative pt-0">
              <Button 
                onClick={() => setSelectedKit(kit)}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Personalizar e Adicionar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Carrinho Lateral */}
      {cart.length > 0 && (
        <Card className="fixed bottom-6 right-6 w-80 shadow-xl z-50 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Seu Carrinho ({cart.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3 max-h-64 overflow-y-auto">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-start text-sm border-b pb-2 last:border-0">
                <div className="flex-1">
                  <div className="font-medium">{item.kit.nome}</div>
                  <div className="text-xs text-muted-foreground">Qtd: {item.quantidade}</div>
                  {item.customizations.trocas.length > 0 && (
                    <div className="text-xs text-blue-600">
                      {item.customizations.trocas.length} troca(s)
                    </div>
                  )}
                  {item.customizations.extras.length > 0 && (
                    <div className="text-xs text-green-600">
                      {item.customizations.extras.length} extra(s)
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    <Money value={item.precoFinal * item.quantidade} />
                  </div>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeFromCart(index)}
                    className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          
          <Separator />
          
          <CardFooter className="pt-4 pb-4 flex-col space-y-3">
            <div className="w-full flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <Money value={getTotalCart()} />
            </div>
            <Button 
              onClick={() => setShowCheckout(true)}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Finalizar Pedido
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Modal de Personalização */}
      {selectedKit && (
        <KitCustomizer
          kit={selectedKit}
          onAddToCart={handleAddToCart}
          onClose={() => setSelectedKit(null)}
        />
      )}
    </div>
  );
}