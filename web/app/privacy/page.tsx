export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Política de Privacidade
                </h1>

                <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Última atualização: {new Date().toLocaleDateString('pt-BR')}
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introdução</h2>
                        <p>
                            A Vasta ("nós", "nosso" ou "nossa") está comprometida em proteger sua privacidade.
                            Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos
                            suas informações quando você utiliza nosso serviço, em conformidade com a Lei Geral
                            de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Dados que Coletamos</h2>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2.1 Dados Fornecidos por Você</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Nome completo</li>
                            <li>Endereço de e-mail</li>
                            <li>Nome de usuário</li>
                            <li>Informações de perfil (bio, links, imagens)</li>
                            <li>Respostas a formulários</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 mt-4">2.2 Dados Coletados Automaticamente</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Endereço IP</li>
                            <li>Tipo de navegador</li>
                            <li>Dispositivo utilizado</li>
                            <li>Sistema operacional</li>
                            <li>Páginas visitadas e tempo de navegação</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Como Usamos Seus Dados</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Fornecer, operar e manter nossa plataforma</li>
                            <li>Autenticar e gerenciar sua conta</li>
                            <li>Personalizar sua experiência</li>
                            <li>Enviar notificações importantes</li>
                            <li>Melhorar nossos serviços através de análises</li>
                            <li>Detectar e prevenir fraudes</li>
                            <li>Cumprir obrigações legais</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Base Legal (LGPD)</h2>
                        <p>Processamos seus dados pessoais com base em:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Consentimento:</strong> Para cookies não essenciais e marketing</li>
                            <li><strong>Execução de contrato:</strong> Para fornecer os serviços contratados</li>
                            <li><strong>Legítimo interesse:</strong> Para melhorias e segurança</li>
                            <li><strong>Cumprimento de obrigação legal:</strong> Quando exigido por lei</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Compartilhamento de Dados</h2>
                        <p>Compartilhamos seus dados apenas com:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Supabase:</strong> Infraestrutura de banco de dados e autenticação</li>
                            <li><strong>Cloudflare:</strong> Segurança e proteção contra bots</li>
                            <li><strong>Vercel:</strong> Hospedagem da plataforma</li>
                        </ul>
                        <p className="mt-4">
                            Nunca vendemos seus dados pessoais a terceiros.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Seus Direitos (LGPD)</h2>
                        <p>Você tem o direito de:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Confirmar a existência de tratamento de dados</li>
                            <li>Acessar seus dados</li>
                            <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                            <li>Solicitar anonimização, bloqueio ou eliminação</li>
                            <li>Revogar o consentimento</li>
                            <li>Obter portabilidade dos dados</li>
                            <li>Solicitar informação sobre compartilhamento</li>
                            <li>Obter informações sobre a possibilidade de não fornecer consentimento</li>
                        </ul>
                        <p className="mt-4">
                            Para exercer seus direitos, entre em contato através de:{' '}
                            <a href="mailto:privacidade@vasta.app" className="text-blue-600 dark:text-blue-400 underline">
                                privacidade@vasta.app
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Cookies e Tecnologias</h2>
                        <p>
                            Utilizamos cookies e tecnologias semelhantes. Consulte nosso banner de cookies
                            para gerenciar suas preferências. Para mais detalhes, veja nossa lista completa
                            de cookies na seção "Gerenciar Preferências" do banner.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Segurança</h2>
                        <p>
                            Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados,
                            incluindo criptografia, controle de acesso e monitoramento contínuo.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Retenção de Dados</h2>
                        <p>
                            Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas
                            nesta política ou conforme exigido por lei. Após esse período, os dados são
                            anonimizados ou excluídos de forma segura.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Contato do DPO</h2>
                        <p>
                            Para questões relacionadas à privacidade de dados, entre em contato com nosso
                            Encarregado de Proteção de Dados:
                        </p>
                        <p className="mt-2">
                            E-mail:{' '}
                            <a href="mailto:dpo@vasta.app" className="text-blue-600 dark:text-blue-400 underline">
                                dpo@vasta.app
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Alterações</h2>
                        <p>
                            Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças
                            significativas através de e-mail ou aviso em nossa plataforma.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
