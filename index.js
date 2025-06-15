require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const destinatario = "marcelo.machado@viannasempre.com.br"; // Substitua aqui

const enviarEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: `"Lembrete de Gastos" <${process.env.SMTP_USER}>`,
      to: destinatario,
      subject: "💸 Hora de lançar seus gastos!",
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px; background: #f7f7f7;">
          <h2 style="color: #333;">📅 Lembrete financeiro</h2>
          <p style="font-size: 16px;">Hora de lançar os seus gastos diários.</p>
          <a href="https://lancamento-gastos.caprover.m2195m.vps-kinghost.net" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Acessar plataforma
          </a>
        </div>
      `
    });

    console.log(`E-mail enviado: ${info.messageId}`);
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err.message);
  }
};

// ⏰ Agendamentos: 9h, 12h, 17h e 21h
cron.schedule('0 9 * * *', enviarEmail, { timezone: 'America/Sao_Paulo' });
cron.schedule('0 12 * * *', enviarEmail, { timezone: 'America/Sao_Paulo' });
cron.schedule('0 17 * * *', enviarEmail, { timezone: 'America/Sao_Paulo' });
cron.schedule('0 21 * * *', enviarEmail, { timezone: 'America/Sao_Paulo' });
// 🔁 ENVIO DE TESTE A CADA 5 MINUTOS
cron.schedule('*/5 * * * *', () => {
  console.log('🧪 Enviando e-mail de teste (intervalo de 5 min)');
  enviarEmail();
}, { timezone: 'America/Sao_Paulo' });


app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
