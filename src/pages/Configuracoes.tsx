export default function Configuracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Configure as preferências do sistema
        </p>
      </div>
      
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2 text-warning">Em desenvolvimento</h2>
        <p className="text-warning-foreground">A funcionalidade de configurações será implementada em breve!</p>
      </div>
    </div>
  );
}