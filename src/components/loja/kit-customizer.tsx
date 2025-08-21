import { useState, useEffect } from 'react';
import { X, Plus, Minus, ArrowRightLeft, ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Money } from '@/components/ui/money';
import { useEstoqueStore } from '@/stores/useEstoqueStore';
import { Kit, ItemEstoque } from '@/domain/types';

interface KitCustomizerProps {
  kit: Kit;
  onAddToCart: (cartItem: any) => void;
  onClose: () => void;
}

interface Troca {
  itemOriginal: string;
  itemNovo: string;
  diferenca: number;
}

interface Extra {
  itemId: string;
  quantidade: number;
  preco: number;
}

// Preços dos itens individuais conforme especificação
const PRECOS_INDIVIDUAIS: Record<string, number> = {
  'Picanha Suína': 25.00,
  'Frango': 25.00,
  'Pão de Alho': 17.00,
  'Contra Filé Grill': 78.00,
  'Linguiça Toscana': 25.00,
  'Carvão': 20.00,
  'Farofa': 17.00,
  'Queijo Coalho': 25.00,
  'Picanha Argentina': 150.00,
  'Picanha Angus': 150.00,
  'Bife de Chorizo': 97.00,
  'Picanha do Chefe': 130.00,
  'Picanha Maturata': 130.00,
  'Picanha Pul Premium': 140.00,
  'Bananinha': 83.90,
  'Fraldinha': 68.00,
  'Linguiça de Queijo': 37.00,
  'Linguiça de Cerveja': 25.00,
  'Cupim': 38.50,
  'Costa Suína': 58.00,
  'Bife de Ancho': 78.00
};

// Trocas permitidas
const TROCAS_PERMITIDAS = [
  { de: 'Linguiça Toscana', para: 'Pão de Alho' },
  { de: 'Picanha Suína', para: 'Linguiça Toscana' },
  { de: 'Drumet na Mostarda', para: 'Linguiça Toscana' },
  { de: 'Pão de Alho', para: 'Linguiça Toscana' },
  { de: 'Pão de Alho', para: 'Drumet na Mostarda' },
  { de: 'Pão de Alho', para: 'Picanha Suína' }
];

export function KitCustomizer({ kit, onAddToCart, onClose }: KitCustomizerProps) {
  const { itens, loadingItens, loadItens } = useEstoqueStore();
  const [quantidade, setQuantidade] = useState(1);
  const [trocas, setTrocas] = useState<Troca[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);

  useEffect(() => {
    loadItens();
  }, [loadItens]);

  const getItemNome = (itemId: string) => {
    const item = itens.find(i => i.id === itemId);
    return item?.nome || 'Item não encontrado';
  };

  const calcularPrecoFinal = () => {
    let precoBase = kit.preco;
    
    // Aplicar diferenças das trocas
    const diferencaTrocas = trocas.reduce((sum, troca) => sum + troca.diferenca, 0);
    
    // Somar extras
    const precoExtras = extras.reduce((sum, extra) => sum + (extra.preco * extra.quantidade), 0);
    
    return precoBase + diferencaTrocas + precoExtras;
  };

  const adicionarTroca = (itemOriginal: string, itemNovo: string) => {
    const precoOriginal = PRECOS_INDIVIDUAIS[itemOriginal] || 0;
    const precoNovo = PRECOS_INDIVIDUAIS[itemNovo] || 0;
    const diferenca = precoNovo - precoOriginal;

    const novaTroca: Troca = {
      itemOriginal,
      itemNovo,
      diferenca
    };

    setTrocas(prev => [...prev, novaTroca]);
  };

  const removerTroca = (index: number) => {
    setTrocas(prev => prev.filter((_, i) => i !== index));
  };

  const adicionarExtra = (nomeItem: string, preco: number) => {
    const item = itens.find(i => i.nome === nomeItem);
    if (!item) return;

    const extraExistente = extras.find(e => e.itemId === item.id);
    if (extraExistente) {
      setExtras(prev => prev.map(e => 
        e.itemId === item.id 
          ? { ...e, quantidade: e.quantidade + 1 }
          : e
      ));
    } else {
      setExtras(prev => [...prev, {
        itemId: item.id,
        quantidade: 1,
        preco: preco
      }]);
    }
  };

  const removerExtra = (itemId: string) => {
    setExtras(prev => prev.filter(e => e.itemId !== itemId));
  };

  const alterarQuantidadeExtra = (itemId: string, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removerExtra(itemId);
      return;
    }
    
    setExtras(prev => prev.map(e => 
      e.itemId === itemId 
        ? { ...e, quantidade: novaQuantidade }
        : e
    ));
  };

  const handleAddToCart = () => {
    const cartItem = {
      kit,
      quantidade,
      customizations: { trocas, extras },
      precoFinal: calcularPrecoFinal()
    };
    
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{kit.nome}</DialogTitle>
          <DialogDescription>
            Personalize seu kit com trocas e itens extras
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Lado Esquerdo - Personalização */}
          <div className="space-y-6">
            {/* Quantidade */}
            <Card>
              <CardHeader>
                <CardTitle>Quantidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold w-12 text-center">{quantidade}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantidade(quantidade + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trocas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowRightLeft className="h-5 w-5 mr-2" />
                  Trocas Disponíveis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  {TROCAS_PERMITIDAS.map((troca, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div className="text-sm">
                        <span className="font-medium">{troca.de}</span>
                        <ArrowRightLeft className="h-4 w-4 inline mx-2 text-muted-foreground" />
                        <span className="font-medium">{troca.para}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs">
                          {((PRECOS_INDIVIDUAIS[troca.para] || 0) - (PRECOS_INDIVIDUAIS[troca.de] || 0)) >= 0 ? '+' : ''}
                          <Money value={(PRECOS_INDIVIDUAIS[troca.para] || 0) - (PRECOS_INDIVIDUAIS[troca.de] || 0)} />
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adicionarTroca(troca.de, troca.para)}
                        >
                          Trocar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {trocas.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Trocas Selecionadas:</h5>
                    {trocas.map((troca, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">
                          {troca.itemOriginal} → {troca.itemNovo}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">
                            {troca.diferenca >= 0 ? '+' : ''}
                            <Money value={troca.diferenca} />
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removerTroca(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Itens Extras */}
            <Card>
              <CardHeader>
                <CardTitle>Itens Extras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Cortes Especiais</h5>
                  <div className="grid gap-2">
                    {Object.entries(PRECOS_INDIVIDUAIS)
                      .filter(([nome]) => ['Picanha Argentina', 'Picanha Angus', 'Bife de Chorizo', 'Picanha do Chefe', 'Picanha Maturata', 'Picanha Pul Premium', 'Bananinha', 'Fraldinha', 'Linguiça de Queijo', 'Linguiça de Cerveja', 'Cupim', 'Costa Suína', 'Bife de Ancho'].includes(nome))
                      .map(([nome, preco]) => (
                        <div key={nome} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{nome}</div>
                            {nome === 'Linguiça de Cerveja' && (
                              <Badge variant="secondary" className="text-xs">Promoção!</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm"><Money value={preco} /></span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => adicionarExtra(nome, preco)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {extras.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Extras Selecionados:</h5>
                    {extras.map((extra) => {
                      const item = itens.find(i => i.id === extra.itemId);
                      return (
                        <div key={extra.itemId} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm font-medium">{item?.nome}</span>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => alterarQuantidadeExtra(extra.itemId, extra.quantidade - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">{extra.quantidade}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => alterarQuantidadeExtra(extra.itemId, extra.quantidade + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm"><Money value={extra.preco * extra.quantidade} /></span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removerExtra(extra.itemId)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Lado Direito - Resumo */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Kit {kit.nome}</span>
                    <Money value={kit.preco} />
                  </div>
                  
                  {trocas.map((troca, index) => (
                    <div key={index} className="flex justify-between text-sm text-blue-600">
                      <span>Troca: {troca.itemOriginal} → {troca.itemNovo}</span>
                      <span>{troca.diferenca >= 0 ? '+' : ''}<Money value={troca.diferenca} /></span>
                    </div>
                  ))}

                  {extras.map((extra) => {
                    const item = itens.find(i => i.id === extra.itemId);
                    return (
                      <div key={extra.itemId} className="flex justify-between text-sm text-green-600">
                        <span>Extra: {item?.nome} (x{extra.quantidade})</span>
                        <Money value={extra.preco * extra.quantidade} />
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal por Kit</span>
                    <Money value={calcularPrecoFinal()} />
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Quantidade</span>
                    <span>x{quantidade}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold text-primary">
                    <span>Total</span>
                    <Money value={calcularPrecoFinal() * quantidade} />
                  </div>
                </div>

                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}