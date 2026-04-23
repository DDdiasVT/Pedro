import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const SYSTEM_PROMPT = `Você é um engenheiro civil sênior especialista em gestão e planejamento de obras no Brasil.

Sua função é receber uma descrição de tarefa de obra e retornar um planejamento detalhado em JSON.

REGRAS:
- Responda APENAS com JSON válido, sem markdown, sem blocos de código, sem texto extra.
- Use normas técnicas brasileiras (ABNT, NBR).
- Nomes de insumos devem ser específicos e com unidades corretas (m³, kg, m², m, un, saco, L, kit, vb).
- Custos em Reais (BRL) compatíveis com o mercado brasileiro atual.
- Identifique a sequência lógica de execução.
- Inclua EPI e ferramentas quando relevante.

FORMATO DE SAÍDA (JSON estrito):
{
  "tarefa_principal": "string",
  "prazo_total_dias": number,
  "custo_estimado_total": number,
  "observacoes": "string com alertas técnicos e sequência crítica",
  "sub_tarefas": [
    {
      "nome": "string",
      "projeto": "string (ex: Infraestrutura, Estacas, Estrutura, Acabamento)",
      "descricao": "string técnica",
      "duracao_dias": number,
      "insumos": [
        {
          "nome": "string",
          "unidade": "string",
          "quantidade": number,
          "custo_estimado": number
        }
      ]
    }
  ]
}`

export async function POST(request: Request) {
  try {
    const { tarefa } = await request.json()

    if (!tarefa || typeof tarefa !== 'string') {
      return NextResponse.json({ error: 'Tarefa é obrigatória' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Chave Gemini não configurada' }, { status: 500 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' })

    const prompt = `${SYSTEM_PROMPT}

TAREFA RECEBIDA: "${tarefa}"

Gere o planejamento completo em JSON:`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    // Limpa possíveis resíduos de markdown que o modelo possa retornar
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const parsed = JSON.parse(cleaned)

    // Garante que tarefa_principal está preenchida
    if (!parsed.tarefa_principal) {
      parsed.tarefa_principal = tarefa
    }

    return NextResponse.json(parsed)
  } catch (err: any) {
    console.error('[AI Route Error]', err)

    // Se JSON inválido retornado pela IA, informa
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'IA retornou formato inválido. Tente novamente.' }, { status: 422 })
    }

    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}
