import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import appConfig from "../config.json";

export default function HomePage() {
  const [username, setUsername] = useState('');
  const roteamento = useRouter();
  
  function Title(props) {
    const Tag = props.tag || 'h1';
    return (
    <>
      <Tag>{props.children + `${username}` + '!'}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.neutrals["000"]};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
    );
  }

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: "url(https://i.ibb.co/v3vpGk6/agentes.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          }}
        >
          <Box
            as="form"
            onSubmit={function (infosDoEvento){
              infosDoEvento.preventDefault();
              {username.length > 2 ? roteamento.push(`/chat?username=${username}`) : alert('Usuário não encontrado!')};
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Title tag="h1">Saudações Invocador </Title>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              value={username}
              onChange={function Handler(e){
                setUsername(e.target.value);
              }}
              placeholder="Digite seu usuário do Github"
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[300],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["999"],
                mainColor: appConfig.theme.colors.primary[300],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>

          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              border: "1px solid",
              borderColor: appConfig.theme.colors.primary[300],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
              }}
              src={username.length > 2 ? `https://github.com/${username}.png` : 'https://i.ibb.co/1z5xC0s/icone.png'} 
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.primary[300],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {username.length > 2 ? `${username}` : 'Usuário inválido'}
            </Text>
          </Box>
          
        </Box>
      </Box>
    </>
  );
}