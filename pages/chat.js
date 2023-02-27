import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React, { useEffect, useState } from "react";
import appConfig from "../config.json";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
      .from('mensagens')
      .on('INSERT', (respostaLive) => {
        adicionaMensagem(respostaLive.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const roteamento = useRouter();
  const { username } = roteamento.query;
  const [mensagem, setMensagem] = useState("");
  const [listaDeMensagens, setListaDeMensagens] = useState([]);

  useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data);
      });

    const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
      setListaDeMensagens((valorAtualLista) => {
        return [
          novaMensagem, 
          ...valorAtualLista,
        ]
      });
    });

    return () => {
      subscription.unsubscribe();
    }
  }, []);

  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: username,
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert([
        mensagem,
      ])
      .then(({ data }) => {});
    setMensagem("");
  }
  
  return (
    <Box
      styleSheet={{
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://i.ibb.co/v3vpGk6/agentes.jpg)`,
        backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          height: "100%",
          maxWidth: "75%",
          maxHeight: "95vh",
          padding: "2rem",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.primary[800],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "1rem",            
          }}
        >
          <MessageList mensagens={listaDeMensagens} />

          <Box
            as="form"
            styleSheet={{
              display: "flex", alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(e) => {
                setMensagem(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  {mensagem.length > 0 ? handleNovaMensagem(mensagem) : alert('Preencha o campo de texto para enviar a mensagem')};
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "90%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.primary[300],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[999],
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNovaMensagem(':sticker: ' + sticker);
              }}
            />
            <Button
              type="submit"
              label="Enviar"
              onClick={(event) => {
                event.preventDefault();
                {
                  mensagem.length > 0
                    ? handleNovaMensagem(mensagem)
                    : alert("Preencha o campo de texto para enviar a mensagem");
                }
              }}
              styleSheet={{
                width: "5%",
                borderRadius: "5px",
                height: "75%",
                marginBottom: "8px",
              }}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals[999],
                mainColor: appConfig.theme.colors.primary[300],
                mainColorLight: appConfig.theme.colors.primary[600],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "1rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          styleSheet={{
            border: "1px solid",
            borderRadius: "10px", 
          }}
          buttonColors={{
            contrastColor: appConfig.theme.colors.neutrals[999],
            mainColor: appConfig.theme.colors.primary[300],
            mainColorLight: appConfig.theme.colors.primary[600],
            mainColorStrong: appConfig.theme.colors.primary[600],
          }}
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "1rem",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "0.75rem",
              wordBreak: "break-word",
              hover: {
                backgroundColor: appConfig.theme.colors.primary[600],
                color: appConfig.theme.colors.neutrals[999]
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            {mensagem.texto.startsWith(":sticker:") ? (
              <Image style={{width: '220px'}} src={mensagem.texto.replace(":sticker:", "")} />
            ) : (
              mensagem.texto
            )}
          </Text>
        );
      })}
    </Box>
  );
}
