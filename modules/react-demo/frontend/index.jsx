const React = HomePortal.dependencies.react;
const ReactDOM = HomePortal.dependencies.reactDOM;

class LikeButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = { liked: false };
	}

	render() {
		let content;
		if (this.state.liked)
			return <div>You liked this.</div>;

		return (
			<button onClick={ () => this.setState({ liked: true }) }>Like</button>
		);
	}
}

HomePortal.registerWidget({
	name: "react-demo",
	mount: el => ReactDOM.render(
		<div className="panel" style={{height: "100%"}}>
			<LikeButton />
		</div>, el)
});
