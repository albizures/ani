import React from 'react';
import anime from 'animejs';
import Prism from 'prismjs';
// import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-dark.css';

interface CodeProps {
	children: string;
}

enum NodeTypes {
	ELEMENT_NODE = 1,
	TEXT_NODE = 3,
}

const changeNodes = (el: Node) => {
	const nodes: ChildNode[] = [];

	el.childNodes.forEach((e) => nodes.push(e));

	for (const element of nodes) {
		if (element.textContent?.includes('\n')) {
			const line = document.createElement('div');

			el.insertBefore(line, element);
		}

		if (element.nodeType == NodeTypes.TEXT_NODE) {
			const text = element.textContent;

			if (!text) {
				continue;
			}

			for (let index = 0; index < text.length; index++) {
				const letter = text[index];
				const span = document.createElement('span');

				span.textContent = letter;

				span.classList.add('letter-code');
				el.insertBefore(span, element);
			}

			element.remove();
		} else {
			changeNodes(element);
		}
	}
};

const Code: React.FC<CodeProps> = (props) => {
	const elRef = React.useRef<HTMLPreElement>(null);
	const { children } = props;
	const [code, setCode] = React.useState('');

	React.useEffect(() => {
		const html = Prism.highlight(
			children,
			Prism.languages.javascript,
			'javascript',
		);

		setCode(html);
	}, []);

	React.useEffect(() => {
		elRef.current && changeNodes(elRef.current);

		anime({
			targets: '.letter-code',
			rotateY: [-90, 0],
			opacity: 1,
			duration: 500,
			delay: (el, i) => 4 * i,
		});
	}, [code]);

	return (
		<pre ref={elRef} dangerouslySetInnerHTML={{ __html: code }} />
	);
};

export const App = () => {
	const [showCode, setShowCode] = React.useState(false);
	React.useEffect(() => {
		const ani = anime({
			targets: '.el',
			translateX: 250,
			rotate: '1turn',
			backgroundColor: '#FFF',
			duration: 800,
			complete: () => {
				setShowCode(true);
			},
		});
	}, []);

	return (
		<div>
			<h1>lelel</h1>
			<span className="el" />
			{showCode && (
				<Code>
					{`const ani = anime({
  targets: '.el',
  translateX: 250,
  rotate: '1turn',
  backgroundColor: '#FFF',
  duration: 800,
});
`}
				</Code>
			)}
		</div>
	);
};
