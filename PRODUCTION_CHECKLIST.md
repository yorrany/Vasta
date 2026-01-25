# ⚠️ CHECKLIST DE PRODUÇÃO - STRIPE

**Status**: 🔴 MODO PRODUÇÃO ATIVADO - PAGAMENTOS REAIS SERÃO PROCESSADOS

## ✅ Checklist Obrigatório Antes de Ir Live

### 1. Configuração Stripe

- [x] Chaves de produção configuradas (`pk_live_` e `sk_live_`)
- [x] Price IDs de produção configurados
- [ ] **Webhooks configurados em produção**
- [ ] **Endereço de webhook verificado**
- [ ] **Eventos de webhook testados**

### 2. Banco de Dados

- [ ] **Script SQL executado no Supabase (`db/add_stripe_columns.sql`)**
- [ ] **Colunas criadas**: `stripe_customer_id`, `stripe_subscription_id`, etc.
- [ ] **Índices criados** para performance
- [ ] **Backup do banco realizado**

### 3. Testes Críticos (USE CARTÃO REAL COM PEQUENO VALOR!)

- [ ] Signup funciona corretamente
- [ ] Upgrade para plano Pro completa com sucesso
- [ ] Upgrade para plano Business completa com sucesso
- [ ] Dados sincronizam no Supabase após pagamento
- [ ] Página `/checkout/success` funciona
- [ ] Dashboard mostra plano correto após upgrade
- [ ] Cancelamento de assinatura funciona (testar depois)

### 4. Segurança

- [ ] `.env.local` **NÃO** está no Git
- [ ] `.gitignore` inclui `.env*.local`
- [ ] Chaves secretas nunca expostas no client-side
- [ ] Rate limiting implementado nas APIs
- [ ] CORS configurado corretamente
- [ ] HTTPS ativado (obrigatório para Stripe)

### 5. Monitoring & Logging

- [ ] Logs de erro configurados
- [ ] Alertas de falha de pagamento configurados
- [ ] Dashboard Stripe monitorado regularmente
- [ ] Notificações de webhook failures ativadas

### 6. Configurações Stripe Dashboard

- [ ] Descrição dos produtos está clara
- [ ] Preços estão corretos (R$ 49/mês Pro, R$ 99/mês Business)
- [ ] Billing statements configurados
- [ ] Email de recibos configurado
- [ ] Política de reembolso definida

## 🚨 AÇÕES URGENTES NECESSÁRIAS

### 1. Configurar Webhooks (CRÍTICO!)

**Por que?** Sem webhooks, se um pagamento falhar ou uma assinatura for cancelada, seu banco de dados não será atualizado.

**Como fazer:**

1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em **"Add endpoint"**
3. URL: `https://vasta.pro/api/webhooks/stripe`
4. Eventos para ouvir:
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.paid`
   - ✅ `invoice.payment_failed`
   - ✅ `checkout.session.completed`

5. Copie o **Signing Secret** e adicione ao `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_seu_secret_aqui
   ```

**Criar arquivo de webhook:**

```typescript
// web/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  // Handle the event
  const supabase = await createClient();

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Atualizar perfil do usuário
      await supabase
        .from("profiles")
        .update({
          stripe_subscription_id: subscription.id,
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Voltar para plano gratuito
      await supabase
        .from("profiles")
        .update({
          stripe_subscription_id: null,
          subscription_status: "canceled",
          plan_code: "start",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId);

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      // Marcar como pagamento falho
      await supabase
        .from("profiles")
        .update({
          subscription_status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId);

      // TODO: Enviar email para usuário
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

### 2. Executar SQL no Supabase (CRÍTICO!)

Execute o arquivo `db/add_stripe_columns.sql` no SQL Editor do Supabase:

1. Acesse: https://supabase.com/dashboard/project/fwonowsvrbrgeaahoekk/sql/new
2. Cole o conteúdo do arquivo `db/add_stripe_columns.sql`
3. Execute (botão **RUN**)
4. Verifique se as colunas foram criadas

### 3. Teste com Pagamento Real Pequeno

**IMPORTANTE**: Faça um teste com um valor pequeno primeiro!

1. Use seu próprio cartão real
2. Faça upgrade para o plano Pro
3. Verifique se:
   - Pagamento foi processado
   - Dados apareceram no Supabase
   - Dashboard mostra plano correto
4. Cancele imediatamente no Stripe Dashboard
5. Solicite reembolso

## 📊 Monitoramento Contínuo

### Dashboard Stripe

- **URL**: https://dashboard.stripe.com
- **Verificar diariamente**:
  - Pagamentos recebidos
  - Falhas de pagamento
  - Webhooks com erro
  - Disputes/chargebacks

### Supabase

- **URL**: https://supabase.com/dashboard
- **Verificar regularmente**:
  - Colunas Stripe estão sincronizadas
  - Logs de erro
  - Performance de queries

## 🆘 Contatos de Emergência

### Stripe

- **Support**: https://support.stripe.com
- **Status**: https://status.stripe.com
- **Phone**: Disponível no dashboard

### Supabase

- **Support**: https://supabase.com/support
- **Status**: https://status.supabase.com

## 📝 Notas Importantes

1. **Nunca** teste com cartões reais em ambiente de teste
2. **Sempre** monitore o dashboard Stripe após lançamento
3. **Configure** alertas de email para pagamentos falhos
4. **Documente** todos os Price IDs e produtos
5. **Mantenha** backup das configurações do Stripe
6. **Revise** periodicamente as taxas e preços

## ⚡ Quick Commands

```bash
# Reiniciar servidor após mudanças
npm run dev

# Verificar logs
# (monitore o terminal e Vercel/hosting logs)

# Testar checkout local
# https://localhost:3000
```

---

**Última atualização**: 2026-01-25  
**Responsável**: Equipe Vasta  
**Status**: 🔴 PRODUÇÃO ATIVA
