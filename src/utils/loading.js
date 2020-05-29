export function startLoading(that) {
    that.setState({
        animating: true
    })
}

export function finishLoading(that) {
    that.setState({
        animating: false
    })
}