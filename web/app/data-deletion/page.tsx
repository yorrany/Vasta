import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Exclusão de Dados | Vasta Pro',
    description: 'Como solicitar a exclusão dos seus dados do Vasta Pro',
}

export default function DataDeletionPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Exclusão de Dados do Usuário</h1>
                    <p className="text-slate-600">
                        Como solicitar a exclusão completa dos seus dados da plataforma Vasta Pro
                    </p>
                </div>

                <div className="prose prose-slate max-w-none space-y-6">

                    {/* Introdução */}
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Seu Direito à Exclusão de Dados</h2>
                        <p className="text-slate-700 leading-relaxed">
                            De acordo com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong> e o <strong>Regulamento Geral
                                de Proteção de Dados (GDPR)</strong>, você tem o direito de solicitar a exclusão completa de todos os
                            seus dados pessoais armazenados em nossa plataforma.
                        </p>
                    </section>

                    {/* O que será excluído */}
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-4">O Que Será Excluído?</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Ao solicitar a exclusão da sua conta, os seguintes dados serão permanentemente removidos:
                        </p>
                        <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                            <li><strong>Informações de perfil:</strong> Nome, email, foto, biografia, links</li>
                            <li><strong>Dados de autenticação:</strong> Senha, tokens de sessão</li>
                            <li><strong>Conexões sociais:</strong> Tokens do Instagram, Facebook e outras integrações</li>
                            <li><strong>Conteúdo:</strong> Todos os links, configurações e personalizações</li>
                            <li><strong>Estatísticas:</strong> Dados de visualizações e cliques</li>
                            <li><strong>Dados de pagamento:</strong> Histórico de assinaturas (dados de cartão não são armazenados)</li>
                        </ul>
                    </section>

                    {/* O que NÃO será excluído */}
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-4">O Que Não Será Excluído?</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Por obrigações legais e fiscais, alguns dados podem ser retidos por períodos específicos:
                        </p>
                        <ul className="list-disc list-inside text-slate-700 space-y-2 ml-4">
                            <li><strong>Dados fiscais:</strong> Informações de faturamento (retidas por 5 anos conforme legislação brasileira)</li>
                            <li><strong>Logs de segurança:</strong> Registros de acesso críticos (6 meses)</li>
                            <li><strong>Comunicações legais:</strong> Correspondências relacionadas a processos judiciais</li>
                        </ul>
                        <p className="text-slate-700 leading-relaxed mt-4">
                            Esses dados são anonimizados sempre que possível e excluídos assim que os prazos legais expiram.
                        </p>
                    </section>

                    {/* Como solicitar */}
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Como Solicitar a Exclusão</h2>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                            <h3 className="text-xl font-semibold text-blue-900 mb-3">Opção 1: Excluir Diretamente pelo Dashboard</h3>
                            <ol className="list-decimal list-inside text-blue-900 space-y-2 ml-4">
                                <li>Faça login na sua conta do Vasta Pro</li>
                                <li>Acesse <strong>Configurações → Conta</strong></li>
                                <li>Role até o final da página</li>
                                <li>Clique em <strong>"Excluir Conta Permanentemente"</strong></li>
                                <li>Confirme a exclusão digitando seu email</li>
                                <li>Clique em <strong>"Sim, excluir minha conta"</strong></li>
                            </ol>
                            <div className="mt-4">
                                <Link
                                    href="/dashboard/settings"
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Ir para Configurações
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-slate-900 mb-3">Opção 2: Solicitar por Email</h3>
                            <p className="text-slate-700 mb-3">
                                Se você não consegue acessar sua conta, envie um email para:
                            </p>
                            <div className="bg-white p-4 rounded border border-slate-300">
                                <p className="text-lg font-mono text-blue-600">privacy@vasta.pro</p>
                            </div>
                            <p className="text-slate-700 mt-3 mb-3">
                                <strong>Inclua no email:</strong>
                            </p>
                            <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                                <li>Assunto: <strong>"Solicitação de Exclusão de Dados - LGPD"</strong></li>
                                <li>Seu nome completo</li>
                                <li>Email cadastrado na plataforma</li>
                                <li>Motivo da solicitação (opcional)</li>
                            </ul>
                        </div>
                    </section>

                    {/* Prazo de exclusão */}
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Prazo de Exclusão</h2>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-green-900">Até 30 dias</h3>
                                    <p className="text-green-800 mt-1">
                                        Seus dados serão completamente excluídos em até <strong>30 dias corridos</strong> após a
                                        confirmação da solicitação. Você receberá um email de confirmação quando o processo for concluído.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Exclusão de dados do Instagram */}
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Exclusão de Dados do Instagram</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Se você conectou sua conta do Instagram ao Vasta Pro e deseja remover apenas essa integração:
                        </p>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-purple-900 mb-3">Desconectar Instagram (sem excluir conta Vasta)</h3>
                            <ol className="list-decimal list-inside text-purple-900 space-y-2 ml-4">
                                <li>Faça login no Vasta Pro</li>
                                <li>Vá em <strong>Configurações → Instagram</strong></li>
                                <li>Clique em <strong>"Desconectar Instagram"</strong></li>
                            </ol>
                            <p className="text-purple-800 mt-3 text-sm">
                                ℹ️ Isso removerá apenas os dados do Instagram (token de acesso, username, etc.).
                                Sua conta do Vasta Pro permanecerá ativa.
                            </p>
                        </div>

                        <p className="text-slate-700 leading-relaxed mt-4">
                            Você também pode excluir dados do Instagram diretamente pelo aplicativo do Instagram:
                        </p>
                        <ol className="list-decimal list-inside text-slate-700 space-y-2 ml-4 mt-2">
                            <li>Abra o app do Instagram</li>
                            <li>Vá em <strong>Configurações → Segurança → Apps e Sites</strong></li>
                            <li>Encontre "Vasta Pro" e clique em <strong>"Remover"</strong></li>
                        </ol>
                    </section>

                    {/* Consequências */}
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Consequências da Exclusão</h2>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-red-900 mb-2">⚠️ Esta ação é irreversível!</h3>
                                    <ul className="list-disc list-inside text-red-800 space-y-1">
                                        <li>Sua página pública ficará inacessível imediatamente</li>
                                        <li>Todos os links compartilhados deixarão de funcionar</li>
                                        <li>Você perderá todas as estatísticas e análises</li>
                                        <li>Não será possível recuperar os dados após a exclusão</li>
                                        <li>Assinaturas ativas serão canceladas automaticamente</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Alternativas */}
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Alternativas à Exclusão Completa</h2>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Antes de excluir sua conta permanentemente, considere estas opções:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <h3 className="font-semibold text-slate-900 mb-2">🔒 Desativar Temporariamente</h3>
                                <p className="text-slate-700 text-sm">
                                    Deixe sua conta inativa sem perder os dados. Você pode reativá-la a qualquer momento.
                                </p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <h3 className="font-semibold text-slate-900 mb-2">👁️ Tornar Página Privada</h3>
                                <p className="text-slate-700 text-sm">
                                    Oculte sua página do público sem excluir seus dados e configurações.
                                </p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <h3 className="font-semibold text-slate-900 mb-2">📥 Exportar Dados</h3>
                                <p className="text-slate-700 text-sm">
                                    Baixe uma cópia de todos os seus dados antes de excluir (disponível nas configurações).
                                </p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                <h3 className="font-semibold text-slate-900 mb-2">🔄 Trocar Email</h3>
                                <p className="text-slate-700 text-sm">
                                    Se o problema é privacidade do email, você pode alterá-lo sem excluir a conta.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Contato */}
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Dúvidas ou Problemas?</h2>
                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                            <p className="text-slate-700 mb-4">
                                Se você tiver dúvidas sobre o processo de exclusão ou encontrar problemas, entre em contato:
                            </p>
                            <div className="space-y-2 text-slate-700">
                                <p><strong>Email de Privacidade:</strong> <a href="mailto:privacy@vasta.pro" className="text-blue-600 hover:underline">privacy@vasta.pro</a></p>
                                <p><strong>Suporte Geral:</strong> <a href="mailto:support@vasta.pro" className="text-blue-600 hover:underline">support@vasta.pro</a></p>
                                <p><strong>Documentação:</strong> <Link href="/privacy" className="text-blue-600 hover:underline">Política de Privacidade</Link></p>
                            </div>
                        </div>
                    </section>

                    {/* Botão de ação */}
                    <section className="mt-12 pt-8 border-t border-slate-200">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Pronto para Excluir Sua Conta?</h3>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/dashboard/settings"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                                >
                                    Excluir Minha Conta
                                </Link>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
                                >
                                    Voltar para Home
                                </Link>
                            </div>
                        </div>
                    </section>

                </div>

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <p className="text-sm text-slate-600 text-center">
                        © 2026 YORRANY MARTINS BRAGA LTDA - Vasta Pro. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    )
}
