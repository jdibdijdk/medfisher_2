/**
 * MedRats — recebe as fotos (check-ins e foto de perfil) e guarda na pasta do Google Drive.
 *
 * COMO INSTALAR (uma vez):
 *  1. Acesse script.google.com → Novo projeto → cole este arquivo.
 *  2. Implantar → Nova implantação → tipo "Aplicativo da Web".
 *       Executar como: Eu (a conta dona da pasta)   |   Quem pode acessar: Qualquer pessoa
 *  3. AUTORIZE O DRIVE (passo que costuma faltar): no editor, escolha a função "autorizar" na barra
 *     superior, clique em Executar e aceite as permissões. Depois: Implantar → Gerenciar implantações →
 *     lápis → Versão: "Nova versão" → Implantar. Sem isso as fotos falham com "Access denied: DriveApp".
 *     Copie a URL do aplicativo (termina em /exec).
 *  4. No topo do index.html, em window.CONFIG, preencha:  FOTOS_URL: 'https://script.google.com/macros/s/.../exec'
 *
 * As fotos ficam na pasta abaixo. Para o site exibi-las, a PASTA precisa estar em
 * "Qualquer pessoa com o link" como LEITOR (não Editor). Os arquivos herdam esse acesso.
 * Não há limite de armazenamento no Firebase para isso.
 */
var PASTA_ID = '1PuieHM5YdAYp6gJaBLl36_hJRB_oqMOJ';
var MAX_BYTES = 4 * 1024 * 1024;
// Opcional: defina uma chave e a mesma em FOTOS_CHAVE no index.html para barrar envios de quem não conhece o site.
var CHAVE = '';

function doPost(e) {
  try {
    var req = JSON.parse(e.postData.contents);
    if (req.acao !== 'foto') throw new Error('Ação inválida.');
    if (CHAVE && req.chave !== CHAVE) throw new Error('Chave inválida.');
    if (!/^image\/(jpeg|png|webp)$/.test(String(req.mime))) throw new Error('Formato não aceito (use JPEG, PNG ou WebP).');
    var bytes = Utilities.base64Decode(String(req.dados));
    if (bytes.length > MAX_BYTES) throw new Error('Foto grande demais.');
    var ext = req.mime === 'image/png' ? '.png' : req.mime === 'image/webp' ? '.webp' : '.jpg';
    var nome = String(req.nome || 'foto').replace(/[^\w.-]+/g, '_').slice(0, 60) + '-' + Date.now() + ext;
    var arquivo = DriveApp.getFolderById(PASTA_ID).createFile(Utilities.newBlob(bytes, req.mime, nome));
    // A foto já está salva. Se o Drive recusar mudar o compartilhamento do arquivo, isso não é erro:
    // o arquivo herda o acesso por link da pasta (configure a pasta como "Qualquer pessoa com o link: Leitor").
    try { arquivo.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) { /* herda da pasta */ }
    return saida({ ok: true, id: arquivo.getId() });
  } catch (err) {
    return saida({ ok: false, erro: String(err.message || err) });
  }
}

/** Execute uma vez no editor para conceder a permissão de Drive ao script. */
function autorizar() {
  var pasta = DriveApp.getFolderById(PASTA_ID);
  Logger.log('Autorizado. Pasta: ' + pasta.getName());
}

function doGet() { return saida({ ok: true, servico: 'MedRats fotos' }); }

function saida(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
