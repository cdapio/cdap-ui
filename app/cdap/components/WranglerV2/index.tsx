import React, { useEffect, useState } from 'react';
import { Shell, useShell } from 'components/Shell';
import styled from 'styled-components';

const Snack = styled.div`
  z-index: 100;
  width: 100%;
  height: 32px;
  background: green;
  color: white;
`;

export default function DemoPage() {
  return (
    <Shell
      showAppHeader={true}
      showAppFooter={false}
      actionbar={<h2>Actionbar goes here</h2>}
      toolbar={<h2>Toolbar goes here</h2>}
      footerbar={<h2>Footerbar goes here</h2>}
      content={<DemoPageContent />}
    />
  );
}

function MyForm() {
  const shellApi = useShell();
  const [name, setName] = useState('');

  async function submit() {
    await fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then((response) => response.json())
      .then((json) =>
        shellApi.leftInlayDrawers.openWith(<MyDrawer text={JSON.stringify(json, null, 2)} />)
      );

    shellApi.snackbar.renderWith(<Snack>hello {name}</Snack>);
    shellApi.dialog.hide();
  }

  return (
    <div style={{ padding: '20px' }}>
      <p>Name:</p>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={submit}>submit</button>
    </div>
  );
}

function MyDrawer({ text }) {
  const shellApi = useShell();
  const selfIndex = shellApi.leftInlayDrawers.getDrawerIndex();

  return (
    <>
      <div>Drawer {selfIndex}</div>
      <div>
        <pre>{text}</pre>
        <button onClick={() => shellApi.leftInlayDrawers.close(selfIndex)}>close</button>
      </div>
    </>
  );
}

function DemoPageContent() {
  const shellApi = useShell();

  function showHeader() {
    shellApi.appHeader.show();
  }

  function hideHeader() {
    shellApi.appHeader.hide();
  }

  return (
    <section>
      <h1>Hello</h1>
      <button onClick={shellApi.appHeader.isVisible ? hideHeader : showHeader}>
        {shellApi.appHeader.isVisible ? 'Hide header' : 'showHeader'}
      </button>
      <hr />
      <button onClick={() => shellApi.dialog.renderWith(<MyForm />)}>Open modal with a form</button>
    </section>
  );
}
