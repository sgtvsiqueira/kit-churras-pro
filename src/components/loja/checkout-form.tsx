import { useState } from 'react';
import { ArrowLeft, MapPin, CreditCard, Clock, Phone, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Money } from '@/components/ui/money';
import { usePedidosStore } from '@/stores/usePedidosStore';
import { useToast } from '@/hooks/use-toast';
import { PedidoItem, Cliente } from '@/domain/types';

interface CheckoutFormProps {
  cart: any[];
  onBack: () => void;
}

export function CheckoutForm({ cart, onBack }: CheckoutFormProps) {
  const { createPedido, createCliente } = usePedidosStore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [clienteForm, setClienteForm] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: ''
  });
  const [entregaForm, setEntregaForm] = useState({
    tipo: 'DELIVERY' as 'DELIVERY' | 'RETIRADA',
    endereco: '',
    janela: ''
  });
  const [pagamentoForm, setPagamentoForm] = useState({
    forma: 'PIX' as 'PIX' | 'CREDITO' | 'DEBITO' | 'DINHEIRO',
    pago: false
  });
  const [obs, setObs] = useState('');

  const getTotalCart = () => {
    return cart.reduce((total, item) => total + (item.precoFinal * item.quantidade), 0);
  };

  const getTaxaEntrega = () => {
    return entregaForm.tipo === 'DELIVERY' ? 8.00 : 0;
  };

  const getTotalFinal = () => {
    return getTotalCart() + getTaxaEntrega();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Criar cliente
      const novoCliente: Cliente = await createCliente(clienteForm);
      
      // Preparar itens do pedido
      const itensPedido: PedidoItem[] = cart.map(item => ({
        kitId: item.kit.id,
        quantidade: item.quantidade,
        precoUnitario: item.precoFinal,
        subtotal: item.precoFinal * item.quantidade
      }));

      // Criar pedido
      await createPedido({
        cliente: novoCliente,
        itens: itensPedido,
        status: 'PENDENTE',
        pagamento: {
          forma: pagamentoForm.forma,
          valorTotal: getTotalFinal(),
          pago: pagamentoForm.pago
        },
        entrega: {
          tipo: entregaForm.tipo,
          taxa: getTaxaEntrega(),
          janela: entregaForm.janela || undefined,
          endereco: entregaForm.tipo === 'DELIVERY' ? entregaForm.endereco : undefined
        },
        obs: obs || undefined
      });

      toast({
        title: "Pedido realizado com sucesso!",
        description: `Seu pedido foi registrado. Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(getTotalFinal())}`,
      });

      // Redirect ou limpar carrinho
      window.location.reload();
      
    } catch (error) {
      toast({
        title: "Erro ao processar pedido",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Kits
        </Button>
        <h1 className="text-2xl font-bold">Finalizar Pedido</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
        {/* Formulários - 2 colunas */}
        <div className="md:col-span-2 space-y-6">
          {/* Dados do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="nome">Nome completo *</Label>
                  <Input
                    id="nome"
                    required
                    value={clienteForm.nome}
                    onChange={(e) => setClienteForm(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    required
                    placeholder="(11) 99999-9999"
                    value={clienteForm.telefone}
                    onChange={(e) => setClienteForm(prev => ({ ...prev, telefone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clienteForm.email}
                    onChange={(e) => setClienteForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endereco-cliente">Endereço</Label>
                  <Input
                    id="endereco-cliente"
                    value={clienteForm.endereco}
                    onChange={(e) => setClienteForm(prev => ({ ...prev, endereco: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entrega */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={entregaForm.tipo}
                onValueChange={(value: 'DELIVERY' | 'RETIRADA') => 
                  setEntregaForm(prev => ({ ...prev, tipo: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DELIVERY" id="delivery" />
                  <Label htmlFor="delivery">
                    Delivery (+<Money value={8.00} />)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="RETIRADA" id="retirada" />
                  <Label htmlFor="retirada">Retirada no local (Grátis)</Label>
                </div>
              </RadioGroup>

              {entregaForm.tipo === 'DELIVERY' && (
                <div>
                  <Label htmlFor="endereco-entrega">Endereço de entrega *</Label>
                  <Textarea
                    id="endereco-entrega"
                    required
                    placeholder="Rua, número, bairro, cidade..."
                    value={entregaForm.endereco}
                    onChange={(e) => setEntregaForm(prev => ({ ...prev, endereco: e.target.value }))}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="janela">Horário preferido</Label>
                <Select onValueChange={(value) => setEntregaForm(prev => ({ ...prev, janela: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoje 18:00–19:00">Hoje 18:00–19:00</SelectItem>
                    <SelectItem value="Hoje 19:00–20:00">Hoje 19:00–20:00</SelectItem>
                    <SelectItem value="Hoje 20:00–21:00">Hoje 20:00–21:00</SelectItem>
                    <SelectItem value="Amanhã 11:00–12:00">Amanhã 11:00–12:00</SelectItem>
                    <SelectItem value="Amanhã 18:00–19:00">Amanhã 18:00–19:00</SelectItem>
                    <SelectItem value="Amanhã 19:00–20:00">Amanhã 19:00–20:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={pagamentoForm.forma}
                onValueChange={(value: 'PIX' | 'CREDITO' | 'DEBITO' | 'DINHEIRO') => 
                  setPagamentoForm(prev => ({ ...prev, forma: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PIX" id="pix" />
                  <Label htmlFor="pix">PIX</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CREDITO" id="credito" />
                  <Label htmlFor="credito">Cartão de Crédito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DEBITO" id="debito" />
                  <Label htmlFor="debito">Cartão de Débito</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DINHEIRO" id="dinheiro" />
                  <Label htmlFor="dinheiro">Dinheiro</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Observações sobre o pedido..."
                value={obs}
                onChange={(e) => setObs(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Resumo do Pedido - 1 coluna */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Itens do Carrinho */}
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium">{item.kit.nome}</div>
                        <div className="text-sm text-muted-foreground">Qtd: {item.quantidade}</div>
                      </div>
                      <div className="text-right">
                        <Money value={item.precoFinal * item.quantidade} />
                      </div>
                    </div>
                    
                    {/* Trocas */}
                    {item.customizations.trocas.length > 0 && (
                      <div className="text-xs text-blue-600 pl-4">
                        {item.customizations.trocas.map((troca: any, i: number) => (
                          <div key={i}>• {troca.itemOriginal} → {troca.itemNovo}</div>
                        ))}
                      </div>
                    )}
                    
                    {/* Extras */}
                    {item.customizations.extras.length > 0 && (
                      <div className="text-xs text-green-600 pl-4">
                        {item.customizations.extras.map((extra: any, i: number) => (
                          <div key={i}>• Extra: Item (x{extra.quantidade})</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totais */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <Money value={getTotalCart()} />
                </div>
                
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <Money value={getTaxaEntrega()} />
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg text-primary">
                  <span>Total</span>
                  <Money value={getTotalFinal()} />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}